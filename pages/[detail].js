import { getSortedPostsData, getMoreData } from "../lib/api";
import Link from "next/link";
import Image from "next/image";
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());
const PERPAGE = 4;

export default function Detail({data}){
	return<div className="container">
			<div className="sort-title-detail"><Link href={"/"}><img src="/images/logo.svg" /></Link></div>
		<div className="content">
			<div className="article-detail">
				<div className="title-detail">{data.data.title}</div>
				<p className="isi-summary">{data.data.summary}</p>
				<div className="author" style={{marginBottom:'66px'}}>
					<div>BY</div>
					<div style={{color : "black"}}>{data.data.author.firstName.toUpperCase() +' '+data.data.author.middleName.toUpperCase()+' '+data.data.author.lastName.toUpperCase()}</div>
					<div>IN</div>
					<div style={{color:"black"}}>{data.data.category.name.toUpperCase()}</div>
				</div>
				<Image src={data.data.thumbnail} width={850} height={500} alt={data.data.title} priority={true} style={{borderRadius:'5px'}}/>
				<p className="isi" style={{marginTop:'20px'}}>{data.data.content}</p>
			</div>
		</div>
		<div className="related-section">
			<div className="more">
				<div className="more-1">You might also like...</div>
				<Link className="more-2" href={data.data.slug + "/relates"}>More</Link>
			</div>
			<div className="more-article">
				<ArtikelByKategori categoryId={data.data.category.id} slug={data.data.slug}/>
			</div>
		</div>
	</div>;
}

//Static Generation
export async function getStaticPaths(){
	const getAllSlug = await getMoreData(999)
	const path = getAllSlug.data.map((r) => {
		return {
			params:{
				detail:r.slug,
			},
		}
	})
	return {
		paths:path,
		fallback:false,
	};
}

export async function getStaticProps({params}){
	const dataReq = await fetch(`https://hsi-sandbox.vercel.app/api/articles/${params.detail}`);
	const data = await dataReq.json();
	return {
		props:{data:data},
	}
}

//Client-side data fetching menggunakan swr
function ArtikelByKategori({categoryId,slug}){
	const {data:getPagination} = useSWR(`https://hsi-sandbox.vercel.app/api/articles?perPage=${PERPAGE}`,fetcher);
	const {data:getByKategori} = useSWR(() => `https://hsi-sandbox.vercel.app/api/articles?perPage=${getPagination.meta.pagination.totalPages * PERPAGE}`,fetcher); //Ambil demua data pada api

	if(!getByKategori){
		return <p>Loading</p>
	}
	
	return <>
		{/** Tampilkan **/}
		{getByKategori.data.filter(data => data.category.id === categoryId && data.slug !== slug).map((data,index) => {
			if (index < 2){
				return (<div key={data.id} className="article-related">
						<Image src={data.thumbnail} width={400} height={250} alt={data.title} priority={true} style={{borderRadius:'5px'}}/>
						<div className="author" style={{marginBottom:'10px'}}>
							<div>BY</div>
							<div style={{color : "black"}}>{data.author.firstName.toUpperCase() +' '+data.author.middleName.toUpperCase()+' '+data.author.lastName.toUpperCase()}</div>
							<div>IN</div>
							<div style={{color:"black"}}>{data.category.name.toUpperCase()}</div>
						</div>
						<Link href={data.slug} className="title-article-related">{data.title}</Link>
						<p className="summary-article-related">{data.summary}</p>
					</div>
				)
			}
		})}
	</>
}
