import { LatestPost } from 'common/types/post';
import { getImageUrl } from 'common/utils/getImageUrl';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

type Props = {
    data: Partial<LatestPost>;
};

const LatestPostItem: React.FC<Props> = ({ data }) => {
    return (
        <Link href={`/product/${data?.id}`}>
            <div className="relative cursor-pointer rounded-lg border shadow-md">
                <div className="bg-primary absolute right-2 top-2 rounded-full px-4 py-1 text-white">
                    New
                </div>
                <div>
                    <Image
                        alt={data?.thumbnail ?? ''}
                        className="object-cover"
                        height={300}
                        src={getImageUrl(data?.thumbnail ?? '')}
                        width={300}
                    />
                </div>
                <div className="space-y-2 p-4">
                    <div className="text-xl font-bold">{data?.title}</div>
                    <div className="line-clamp-3 text-slate-500">
                        {data?.briefInfo}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default LatestPostItem;
