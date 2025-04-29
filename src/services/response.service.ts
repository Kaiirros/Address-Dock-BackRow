interface ResponseWrapper {
  status: string;
  event: string;
  body: unknown;
}

const responseWrapper = (
  status: string,
  event_type: string,
  body: unknown
): ResponseWrapper => {
  return { status, event: event_type, body };
};

export default responseWrapper;
