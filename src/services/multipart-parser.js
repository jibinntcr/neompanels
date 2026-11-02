/**
 * Native HTTP Request Body & Multipart/Form-Data Parser
 * Safely parses fields and binary file buffers for NEOM Panels Enquiry submissions.
 */

const querystring = require('querystring');

const MAX_BODY_BYTES = 35 * 1024 * 1024; // 35 MB cap (covers 3 x 10 MB attachments + form fields)

function collectRequestBuffer(req, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        const err = new Error('Payload too large');
        err.statusCode = 413;
        req.destroy();
        reject(err);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function indexOfBuffer(haystack, needle, start = 0) {
  return haystack.indexOf(needle, start);
}

function parseMultipartBuffer(buffer, boundary) {
  const fields = {};
  const files = [];
  const boundaryBuf = Buffer.from(`--${boundary}`);
  const headerDelim = Buffer.from('\r\n\r\n');

  let pos = indexOfBuffer(buffer, boundaryBuf, 0);
  while (pos !== -1) {
    pos += boundaryBuf.length;
    if (buffer[pos] === 0x2d && buffer[pos + 1] === 0x2d) {
      break; // Final --boundary--
    }
    if (buffer[pos] === 0x0d && buffer[pos + 1] === 0x0a) {
      pos += 2;
    }

    const nextBoundary = indexOfBuffer(buffer, boundaryBuf, pos);
    if (nextBoundary === -1) break;

    const headerEnd = indexOfBuffer(buffer, headerDelim, pos);
    if (headerEnd !== -1 && headerEnd < nextBoundary) {
      const headerStr = buffer.subarray(pos, headerEnd).toString('utf8');
      const contentStart = headerEnd + 4;
      // Strip trailing \r\n before next boundary
      let contentEnd = nextBoundary;
      if (
        contentEnd >= 2 &&
        buffer[contentEnd - 2] === 0x0d &&
        buffer[contentEnd - 1] === 0x0a
      ) {
        contentEnd -= 2;
      }
      const partBody = buffer.subarray(contentStart, contentEnd);

      const nameMatch = headerStr.match(/name="([^"]+)"/i);
      const filenameMatch = headerStr.match(/filename="([^"]*)"/i);
      const typeMatch = headerStr.match(/Content-Type:\s*([^\r\n;]+)/i);

      if (nameMatch) {
        const fieldName = nameMatch[1];
        if (filenameMatch) {
          const filename = filenameMatch[1];
          if (filename && partBody.length > 0) {
            files.push({
              fieldName,
              filename,
              declaredMime: typeMatch ? typeMatch[1].trim() : 'application/octet-stream',
              buffer: Buffer.from(partBody),
            });
          }
        } else {
          fields[fieldName] = partBody.toString('utf8');
        }
      }
    }

    pos = nextBoundary;
  }

  return { fields, files };
}

async function parseIncomingEnquiryRequest(req) {
  const contentType = String(req.headers['content-type'] || '');
  const rawBuffer = await collectRequestBuffer(req);

  if (contentType.includes('multipart/form-data')) {
    const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    const boundary = match ? (match[1] || match[2]).trim() : '';
    if (!boundary) {
      return { fields: {}, files: [] };
    }
    return parseMultipartBuffer(rawBuffer, boundary);
  }

  if (contentType.includes('application/json')) {
    try {
      const parsed = JSON.parse(rawBuffer.toString('utf8') || '{}');
      return { fields: parsed, files: [] };
    } catch (_) {
      return { fields: {}, files: [] };
    }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const parsed = querystring.parse(rawBuffer.toString('utf8'));
    return { fields: parsed, files: [] };
  }

  return { fields: {}, files: [] };
}

module.exports = {
  parseIncomingEnquiryRequest,
};
