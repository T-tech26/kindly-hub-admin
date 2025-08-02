'use client'

import ContentForm from '@/components/ContentForm'
import Header from '@/components/Header'
import StorieForm from '@/components/StorieForm'
import React, { useState } from 'react'


const Page = () => {

  const [content, setContent] = useState('news');

  return (
    <section className="flex-1 overflow-y-scroll">
      <Header title="Content Management" />

      <div className="p-8">
        <div className="form-container">
          <div className="form-header">
              <h2 className="form-title">Create New Content</h2>
              <p className="form-subtitle">Add news releases and success stories to keep your community informed</p>
          </div>

          <div className="p-[30px]">
            <div className="mb-[30px]">
                <div className="content-type-tabs">
                    <button className={`tab-button ${content === 'news' ? 'active' : ''}`} onClick={() => setContent('news')}>📰 News Release</button>
                    <button className={`tab-button ${content === 'story' ? 'active' : ''}`} onClick={() => setContent('story')}>🌟 Success Story</button>
                </div>
            </div>
          </div>

          <form id="contentForm" onSubmit={(e) => e.preventDefault()}>
            <div className="p-[30px]">
                <h3 className="section-title">
                  <span className="section-icon">📝</span>
                  Basic Information
                </h3>

                {content === 'news' && (<ContentForm />)}
                {content === 'story' && (<StorieForm />)}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Page