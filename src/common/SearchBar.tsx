import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

export default function SearchBar() {

    const [open, setopen] = useState(false);
    const strokeWidth = { strokeWidth: '.2rem' }

    const inputRef = useRef<HTMLInputElement | null>(null);


    function handleOutsideClick(event: globalThis.MouseEvent) {
        if ((event.target as HTMLInputElement).id !== 'searchbar'){
            setopen(false);
        }
    }

    useEffect(() => {
        if (open) {
            window.addEventListener('click', handleOutsideClick);
        }
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        }
    },[open])


    function toggleSearch(event: MouseEvent<HTMLButtonElement>) {

        event.stopPropagation();

        if (open == false) {
            inputRef.current?.focus;
        }
        setopen(!open);
    }

    return (
        <section className='flex w-full items-center overflow-hidden justify-end '>
            <button className={`h-8 ${open == false ? 'w-8' : 'w-0'}`} onClick={toggleSearch}>
                <SearchIcon style={strokeWidth} />
            </button>
            <section className={`${open == true ? 'w-full border animate-slide-rtl border-white  p-1' : 'w-0 invisible'}
             flex items-center gap-2 bg-dark`}>
                <button className='h-8 w-8 ' onClick={toggleSearch} >
                    <SearchIcon style={strokeWidth} />
                </button>
                <input
                    className='w-full bg-dark outlnie-none'
                    type="text"
                    id='searchbar'
                    name='searchbar' 
                    placeholder='Title ,people, genere'/>
            </section>
        </section>
    )
}
