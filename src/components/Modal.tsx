import React, { LegacyRef, ReactElement, useEffect, useRef } from 'react'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Position } from '../common/typo'

type ModalPros = {
    isOpen: boolean, onClose: (value: boolean) => void,
    title: string | ReactElement, children: React.ReactElement
    , closeModal?: () => void,
    position?: Position | null,
    className?:string
}

export default function Modal({ isOpen, onClose, title, children, closeModal, position , className}: ModalPros) {

    const panelRef = useRef<HTMLDivElement>(null);

    function onMouseLeave() {
        // onClose(false);
        if(closeModal)
        closeModal();
    }

    useEffect(() => {

    }, [panelRef.current]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                            afterEnter={() => {
                                panelRef.current?.addEventListener('mouseleave', onMouseLeave);
                            }}
                            afterLeave={() => {
                                panelRef.current?.removeEventListener('mouseleave', onMouseLeave);
                            }}
                        >
                            <Dialog.Panel
                                ref={panelRef}
                                style={position ? {
                                    position: 'fixed',
                                    ...position
                                } : {}}
                                className={` ${className ? className : 'max-w-md'} w-full  transform overflow-hidden rounded-2xl bg-dark text-left align-middle shadow-xl transition-all`}>
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-white"
                                >
                                    {children}

                                </Dialog.Title>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
