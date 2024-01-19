import {MDXRemote} from 'next-mdx-remote/rsc';
import classNames from "classnames";
import Image from "next/image";
import styles from './article.module.scss'
import Link from "next/link";


export default function Article() {

  const article = {
    title: "What is Subfluid?",
    author: {
      avatar: "/article/avatar.png",
      username: "ribmaster",
      created_at: new Date().toLocaleDateString()
    },
    content: `# What is Subfluid

Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. Epism desk. Rilig gan, i prekar örådisera. Dening nerade. 
Lesserwisser prerar jisade. Lasper eurode, rattsurfa. Kontrasa konade bel inklusive hevitt rel. Yskapet morotsaktivism. Purågt kerat är humir. 
Täng koren ting. Töment. Döheten lang åvav: i primavalens hede. Pojugt anasyliga. Haliga monopulig i hebelt. 

![Image](/article/banner.png)

Epipobel rer mirade i heterogyn. Antigisk uhet, med podda telegt, göst. Refajäng poska gajir. Mivis vadat. Tör orat i ogure inte metrotropi jag jarat. 
Syng teragen. Mipälingar ditoktig depysm. Ontostik seliga alltså infravis i aninade märk-dna. Vittneslitteratur ämir i nende teras. Trenat tehet till resm göng. 
Ongen dina men spesamma därför att fask. Foliehatt hahet pretrenera utom anada potise. Tredore revis, kassa. Triliga nel semidiska: ara teoskop. Sarön elgasbil dörade fastän sespes otora. 
Vul reangar nygöde, trerigt. Intraligt relogi. Sesk gur. Plase farade: och hemiktiga gangen. Negosk nitirtad. 
Vihet misam. Trasade nirad, nisade innan tesade. Råd gut, dor, el. Ter tis sesm, syrade till dagshandlare. Pävuliga rihens jusk visk, gularat. 
Per suprall i mingar makron. Poligen fyk i epitäska. Ponere suprabel. Sygang pode. Antiktiga terja för att pass. `
  }

  return (
      <div className={classNames("max-w-[780px] mx-auto pt-[32px]")}>
        <h2 className={styles.title}>{article.title}</h2>

        <div className={classNames("flex flex-row", styles['card'])}>
          <Image className="rounded-[50%]" src={article.author.avatar} alt={"User Avatar"}
                 width={44} height={44}/>
          <div className="ml-[21px] flex flex-col justify-evenly">
            <p className={styles.username}>{article.author.username}</p>
            <p className={styles['created-time']}>{article.author.created_at}</p>
          </div>
        </div>

        <div className={classNames("flex flex-row", styles['card'])}>

          <button className="flex flex-row">
            <Image src={"/icon/like.svg"} alt={"Like"} width={24} height={24}/>
            <span className="ml-[8px]">14</span>
          </button>
          <button className="flex flex-row ml-[40px]">
            <Image src={"/icon/comment.svg"} alt={"Comment"} width={24} height={24}/>
            <span className="ml-[8px]">7</span>
          </button>
        </div>

        <div className={styles.markdown}>
          <MDXRemote source={article.content}/>
        </div>

        <div>
          <button
              className="w-full h-[44px] bg-[#262626] text-[#FFFFFF] rounded-[6px] mt-[32px] mb-[90px]"
          >
            Subscribe to continue reading
          </button>
        </div>

        <div
            className={classNames("flex flex-row justify-between py-[16px] border-t-[1px] border-t-[#D6D6D6]", styles.footer)}>
          <Link href="/">
            <Image src={"/article-logo.svg"} alt={"Article Logo"} width={92} height={25}/>
          </Link>

          <span className="text-[14px] opacity-30">Powered by Aave</span>
        </div>
      </div>
  )
}