const responseWrapper = (status: string, event_type: string, body: any) => {
    return { status: status, event: event_type, body };
}

export default responseWrapper;