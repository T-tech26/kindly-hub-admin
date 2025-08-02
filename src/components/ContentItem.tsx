import { getSmartDateDisplay } from '@/lib/utils'
import React from 'react'


const ContentItem = (props: CombinedContentItem) => {

  const { type } = props;

  if(type === 'news') {
    const { title, $createdAt } = props;

    return (
      <li className='action-item'>
          <div className='flex-1'>
              <h3 className='action-item-title'>{title}</h3>
              <p className='action-item-meta capitalize'>Press Release • {getSmartDateDisplay($createdAt)}</p>
          </div>
  
          <p className={`action-badge status-confirmed`}>
              published
          </p>
      </li>
    )
  }

  if(type === 'success') {
    const { name, description, $createdAt } = props;

    return (
      <li className='action-item'>
          <div className='flex-1'>
              <h3 className='action-item-title'>Success Story</h3>
              <p className='action-item-meta capitalize'>{name} — <span className='lowercase'>{description}</span> • {getSmartDateDisplay($createdAt)}</p>
          </div>
  
          <p className={`action-badge status-confirmed`}>
              published
          </p>
      </li>
    )
  }

  return null
}

export default ContentItem