export async function getSortedPostsData(sort=""){
	const dataApi = !sort ? await fetch('https://hsi-sandbox.vercel.app/api/articles') : await fetch(`https://hsi-sandbox.vercel.app/api/articles?sort=${sort}`) 
	return dataApi.json();
}

export async function getMoreDataPage(page){
	const dataApi = await fetch(`https://hsi-sandbox.vercel.app/api/articles?page=${page}`);
	return dataApi.json();
}

export async function getMoreData(page,query=""){
	const dataApi = !query ? await fetch(`https://hsi-sandbox.vercel.app/api/articles?perPage=${page}`) : await fetch(`https://hsi-sandbox.vercel.app/api/articles?sort=${query}&perPage=${page}`);
	return dataApi.json();
}

export async function getSortedPostsDataDetail(slug){
	const dataApi = await fetch(`https://hsi-sandbox.vercel.app/api/articles/${slug}`);
	return dataApi.json();
}

