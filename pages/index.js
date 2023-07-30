import { getSortedPostsData } from "../lib/api";
import { usePathname } from 'next/navigation'
import Image from "next/image";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";

const fetcher = url => fetch(url).then(r => r.json());
const PERPAGE = 4 ;

export default function Home({data,sort}){
	const {data:dataMore, size, setSize, isLoading} = useSWRInfinite((index)=>`https://hsi-sandbox.vercel.app/api/articles?perPage=${PERPAGE}&page=${index+1}&sort=${sort ? sort : 'new'}`,fetcher); // Client-side data fething dengan usr
	const articles = dataMore ? [].concat(...dataMore) : [];
	const isLoadingMore = isLoading || (size > 0 && dataMore && typeof dataMore?.[size - 1]?.data === 'undefined');
	const isEmpty = dataMore?.[size - 1]?.data.length === 0 || dataMore?.[size - 1]?.data.length < 0;
	const pathname = usePathname();

	function ButtonMore({loading,empty}){
		if (loading) {
			return <div className="more">Loading...</div>;
		} else if (!loading){
			return <div className="more" onClick={handleClick} hidden={empty}>Load More</div>;
		}

	}

	function handleClick(){
		setSize(size+1);
	}
	
	return <div className="container"> 
		<div className="head">
				
			<div className="sort">
				<Link href="?sort=popular" onClick={()=> {setSize(0)}} className={sort === "popular" ? "sort-select" : "sort-popular"}>Popular</Link>
				<Link href="?sort=new" onClick={()=> {setSize(0)}} className={sort === "new"  || (pathname == "/" && sort != "popular") ? "sort-select" : "sort-new"}>New</Link>
			</div>
			<div className="sort-title"><Link href={"/"}><img src="/images/logo.svg" /></Link></div>
			 
		</div>
		<div className="content">
		{/** Ambil Data Tampilkan 4 Artikel  **/}
		{data.map((item) => {
			return (
			<div key={item.id} className="article">
				<Image className="img-article" src={item.thumbnail} width={570} height={306} alt={item.title} priority={false}/>
				<div className="author">
					<div>BY</div>
					<div style={{color : "black"}}>{item.author.firstName.toUpperCase() +' '+item.author.middleName.toUpperCase()+' '+item.author.lastName.toUpperCase()}</div>
					<div>IN</div>
					<div style={{color:"black"}}>{item.category.name.toUpperCase()}</div>
				</div>
				<Link href={item.slug} className="title">{item.title}</Link>
			</div>
			);
		})}
		{/** Ambil data, Tampilkan 4 data berikutnya  **/}
		{articles.map((article,index) => index !== 0 && article.data.map((article) => {
			return (
			<div key={article.id} className="article">
				<Image className="img-article" src={article.thumbnail} width={570} height={306} alt={article.title} priority={false}/>
				<div className="author">
					<div>BY</div>
					<div style={{color : "black"}}>{article.author.firstName.toUpperCase() +' '+article.author.middleName.toUpperCase()+' '+article.author.lastName.toUpperCase()}</div>
					<div>IN</div>
					<div style={{color:"black"}}>{article.category.name.toUpperCase()}</div>
				</div>
				<Link href={article.slug} className="title">{article.title}</Link>
			</div>
			); 
		}))}
		<ButtonMore loading={isLoadingMore} empty={isEmpty}/>
		</div>
	</div>;
}

//Server Side Rendering
export async function getServerSideProps(context){
	const {query} = context;
	const data = await getSortedPostsData(query.sort ? query.sort : 'new');
	const dataQuery = !query.sort ? null : query.sort;
	return {
		props:{
			data:data.data,
			sort:dataQuery,
		},
	};
} 

