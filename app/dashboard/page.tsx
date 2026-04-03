"use client"
import { Search } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'

function Page() {
  const [userSearchInput, setUserSearchInput] = useState<string>('')

  return (
    <div className="min-w-0">
      {/* {searchsection} */}
      <SearchSection onSearchInput={(value: string) => setUserSearchInput(value)} />
      {/* {templatelistsection} */}
      <TemplateListSection userSearchInput={userSearchInput} />
    </div>
  )
}

export default Page