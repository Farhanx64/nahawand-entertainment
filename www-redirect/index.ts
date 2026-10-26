// Sends www.nahawand.org to the bare domain so Google sees one canonical site.
export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    return Response.redirect(`https://nahawand.org${url.pathname}${url.search}`, 301);
  },
};
