import React, { useEffect } from 'react'
import { fetchRequest, MovieResponse, MovieResult } from '../common/api'
import { ENDPOINT } from '../common/endpoint';
import Banner from '../components/Banner';
import CategoryRow from '../components/CategoryRow';

export default function Browse() {

  return (
    <section className='absolute top-0 bg-black w-full '>
      <Banner />
      <CategoryRow title='MOst popular' endpoint={ENDPOINT.MOVIES_POPULAR} />
      <CategoryRow title='Top Rated' endpoint={ENDPOINT.MOVIES_TOP_RATED} />
      <CategoryRow title='Now playing' endpoint={ENDPOINT.MOVIES_NOW_PLAYING} />
    </section>
  )
}
