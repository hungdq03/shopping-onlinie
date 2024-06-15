import { SearchOutlined } from '@ant-design/icons';
import { cn } from 'common/utils';
import React, { useState } from 'react';

const Search = () => {
    const [inputFocus, setInputFocus] = useState<boolean>(false);
    return (
        <div className="relative">
            <div
                className={cn(
                    'hover:border-primary flex rounded-full bg-slate-100 px-4 py-1.5 text-slate-500 transition-all',
                    inputFocus && 'border-primary border'
                )}
            >
                <input
                    className="caret-primary z-10 h-[30px] w-[350px] border-none bg-transparent outline-none"
                    onBlur={() => setInputFocus(false)}
                    onFocus={() => setInputFocus(true)}
                    placeholder="Nhập tên sản phẩm cần tìm..."
                    type="text"
                />
                <div className="flex w-[20px] items-center justify-center text-xl">
                    <SearchOutlined />
                </div>
            </div>
        </div>
    );
};

export default Search;
