import Image from 'next/image'
import React from 'react'

type NewsArticleProps = {
    title: string,
    summary: string,
    image: string,
    date: string,
}

const NewsArticle = ({ title, summary, image, date }: NewsArticleProps) => {
  return (
    <article className="news-card">
        <div className="news-image">
            <Image
                src={image}
                width={100}
                height={100}
                alt='News image'
                className='size-full'
            />
        </div>
        <div className="news-content">
            <div className="news-date">{date}</div>
            <h3 className="news-title">{title}</h3>
            <p className="news-excerpt">{summary}</p>
        </div>
    </article>
  )
}

export default NewsArticle