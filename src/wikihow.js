import request from 'node-superfetch';

export async function wikihow(query) {
    const q = query.replace(/^((how )?to )/i, '');

    const firstResponse = await request.get('https://www.wikihow.com/api.php').query({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: q,
    });

    if (firstResponse.body.query.searchinfo.totalhits <= 0) return;

    const pageid = firstResponse.body.query.search[0].pageid;

    const { body } = await request.get('https://www.wikihow.com/api.php').query({
        action: 'query',
        format: 'json',
        prop: 'info',
        inprop: 'url',
        pageids: pageid,
        redirects: ''
    });

    const res = body.query.pages[Object.keys(body.query.pages)[0]];

    const data = {
        id: res.pageid,
        title: res.title,
        language: res.pagelanguage,
        url: res.fullurl,
    };

    return data;
}