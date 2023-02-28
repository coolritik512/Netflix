import React, { useEffect, useRef, useState } from 'react'
import { fetchRequest, MovieResponse, MovieResult } from '../common/api';
import { ENDPOINT } from '../common/endpoint';
import ChevronLeft from '@heroicons/react/24/outline/ChevronLeftIcon'
import ChevronRight from '@heroicons/react/24/outline/ChevronRightIcon'
import PageIndicator from './pageIndicator';
import MovieCard from './MovieCard';

type CategoryRowType = {
    title: string,
    endpoint: string,
}

export default function CategoryRow({ title, endpoint }: CategoryRowType) {

    const [categoryData, setcategoryData] = useState<MovieResult[]>([]);

    const slider = useRef<HTMLTableSectionElement>(null);

    let [slideAmount, setslideAmount] = useState(0);

    const [pagesCount, setpagesCount] = useState(0)
    const cardsPerPage = useRef(0);
    const containerRef = useRef<HTMLTableSectionElement>(null);

    const [currentPage, setcurrentPage] = useState(0)

    const disablePrev = currentPage === 0;
    const disableNext = currentPage+1 === pagesCount;

    async function fetchPopularMovies() {
        const response = await fetchRequest<MovieResponse<MovieResult[]>>(endpoint);
        console.log(response.results);
        setcategoryData(response.results);
    }
    const CARD_WIDTH = 200;


    useEffect(() => {
        fetchPopularMovies();
    }, []);

    function showPrev() {
        if (slider.current) {
            slideAmount = slideAmount + getTranslateXValue();
            setslideAmount(slideAmount);
            slider.current.style.transform = `translateX(${slideAmount}%)`
            setcurrentPage(currentPage - 1);

        }
    }

    function showNext() {

        if (slider.current) {
            slideAmount = (slideAmount - getTranslateXValue());
            setslideAmount(slideAmount);
            slider.current.style.transform = `translateX(${slideAmount}%)`
            setcurrentPage(currentPage + 1);
        }

    }

    function getTranslateXValue() {
        let translateX = 0;
        if (slider.current) {
            translateX = ((cardsPerPage.current * CARD_WIDTH) / slider.current.clientWidth) * 100;
        }
        return translateX;
    }

    useEffect(() => {
        if (categoryData.length && containerRef.current) {
            cardsPerPage.current = Math.floor(containerRef.current.clientWidth / CARD_WIDTH);
            setpagesCount(Math.ceil(categoryData.length / cardsPerPage.current))
        }
    }, [categoryData.length]);



    return (
        <section className='row-container ml-12 hover:cursor-pointer'>
            <h2 className='text-xl'>{title}</h2>

            <PageIndicator
             pagesCount={pagesCount} 
             currentPage={currentPage} 
             className='mb-4 transition-opacity duration-100 ease-in '/>

            <section className='relative mb-8 gap-2 overflow-hidden' ref={containerRef}>
                {
                    disablePrev ? null:<button className='absolute z-[1] left-0 justify-center w-12 h-full bg-black/60 opacity-0' onClick={showPrev}>
                        <ChevronLeft />
                    </button> 
                }
                {
                    disableNext ? null:<button className='absolute z-[1] right-0 justify-center w-12 h-full bg-black/60 opacity-0' onClick={showNext}>
                        <ChevronRight />
                    </button>
                }
                <section
                    ref={slider}
                    className='flex transition-transform ease-in-out duration-700 gap-2'>
                    {
                        categoryData.map((row) => {
                            const { id, title, poster_path } = row;
                            return (
                                <MovieCard uid={`${row.id}-${title}`} key={`${row.id}-${title}`} {...row}/>
                            )
                        })
                    }
                </section>
            </section>

        </section>

    )
}
