import Link from 'next/link';
import Header from '~/components/header';

export default function Home() {
    return (
        <div>
            <Header title="Home page" />
            <Link href="/products" legacyBehavior>
                Go to Products
            </Link>
        </div>
    );
}
