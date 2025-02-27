import React from 'react'

const LoadingState = () => {
    return (
        <div>
            <div className="flex flex-row items-start justify-center gap-4 ">
                <div
                    className="rounded-xl bg-gray-200 border-2 border-red-300 shadow-xl"
                    style={{
                        width: 400,
                        height: 200
                    }}
                >
                </div>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full">
                        </div>
                        <div className="h-12 w-96 bg-gray-200 rounded-2xl">
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full">
                        </div>
                        <div className="h-12 w-96 bg-gray-200 rounded-2xl">
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full">
                        </div>
                        <div className="h-12 w-96 bg-gray-200 rounded-2xl">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LoadingState