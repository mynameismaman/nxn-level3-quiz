import Link from "next/link";
import Image from "next/image";
import useSWRInfinite from 'swr/infinite';
import { useState } from "react";

const fetcher = url => fetch(url).then(res => res.json());
const PERPAGE = 4;
export default function Detail({data}){
	return<div className="container-related">
		<div className="top-section">
			<div className="sort-title-detail" style={{marginBottom:"80px"}}><Link href={"/"}><img src="/images/logo.svg" /></Link></div>
			<div style={{width:"840px",marginLeft:"10px"}}>
				<div className="section-1">Related Post Lists</div>
				<div className="section-2">
					<Image src={data.data.thumbnail} width={500} height={300} alt={data.data.title} priority={true} className="image-top-section"/>
					<div className="section-2-1">
						<Link href={data.data.slug} className="related-title">{data.data.title}</Link>
						<p className="related-summary">{data.data.summary}</p>
					</div>
				</div>
			</div>
		</div>
		<RelatedList kategoriId={data.data.category.id} articleId={data.data.id}/>
		<style jsx global>{`
			body {
				background: #F9F9FB;
				margin: unset;
			}
		`}</style>
	</div>;
}

export async function getServerSideProps(context){
	const { params } = context;
	const { relate } = params;
	const dataDetail = await fetch(`https://hsi-sandbox.vercel.app/api/articles/${relate[0]}`);
	const data = await dataDetail.json();

	if(relate[1] !== "relates" || !data || relate.length > 2 || dataDetail.status !== 200) {
		return {
			notFound: true,
		}
	} 

	return {
		props:{
			data:data,
		}
	}
}

function RelatedList({kategoriId,articleId}){
	const {data:getByKategori, error, isLoading} = useSWRInfinite(() => 'https://hsi-sandbox.vercel.app/api/articles?perPage=999',fetcher)
	const [listNumber, setListNumber] = useState(PERPAGE);
	if (error){
		return <div className="more">Error Load</div>
	} else if (isLoading) {
		return <div className="more">Loading...</div>
	}

	const relatedArticles = getByKategori && getByKategori[0].data.filter(data => data.category.id === kategoriId && articleId != data.id);

	return <div className="card-section">
		{relatedArticles && relatedArticles.map((article,index) =>  { if (index < listNumber ){ return (
			<div key={article.id} className="card-related">
				<div className="card-related-section-1">
					<div className="num">{(index + 1) > 9 ? index + 1 : "0"+(index+1)}</div>
					<Link href={article.slug} className="title-related-section">{article.title}</Link>
					<div className="summary-related-section">{article.summary.substring(0,120)}{article.summary.length > 120 && " ..."} </div>
				</div>
				<Image src={article.thumbnail} width={330} height={230} alt={article.title} priority={false} className="image-related-section"/>

			</div>
		)}})}
		{/**Tampilkan jika data masih lebih banyak dari jumlah listNumber**/}
		<div onClick={() => setListNumber(listNumber+PERPAGE)} hidden={(relatedArticles && relatedArticles.length) < listNumber ? true : false} className="more" style={{marginTop:"20px"}}>Load More</div>
	</div>

}
