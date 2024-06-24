import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Menu, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { get } from 'common/utils/http-request';
import styles from '../../styles/Sidebar.module.css';

const { Sider } = Layout;
const { Search } = Input;

type Category = {
    id: string;
    name: string;
};

type SidebarProps = {
    setCategory?: (category: string) => void;
    handleResetFilters?: () => void;
    handleSearch?: (
        page: number,
        sort?: string,
        sortOrder?: string,
        category?: string,
        searchTerm?: string,
        pageSize?: number
    ) => void;
    currentCategory?: string;
    isDetailPage?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
    setCategory,
    handleResetFilters,
    handleSearch,
    currentCategory,
    isDetailPage = false,
}) => {
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(currentCategory);

    const { data: categories = [], isLoading: categoryLoading } = useQuery<
        Category[]
    >({
        queryKey: ['category'],
        queryFn: () => get('category').then((res) => res.data.data),
    });

    const router = useRouter();

    useEffect(() => {
        setSelectedCategory(currentCategory);
    }, [currentCategory]);

    const handleCategoryChange = (category: string) => {
        if (selectedCategory === category) {
            if (setCategory) {
                setCategory('');
            }
            setSelectedCategory('');
            if (handleSearch) {
                handleSearch(1, undefined, undefined, '');
            }
        } else {
            if (setCategory) {
                setCategory(category);
            }
            setSelectedCategory(category);
            if (isDetailPage) {
                router.push({
                    pathname: '/blog',
                    query: { category },
                });
            } else if (handleSearch) {
                handleSearch(1, undefined, undefined, category);
            }
        }
    };

    const onSearch = (value: string) => {
        if (handleSearch) {
            handleSearch(1, undefined, undefined, selectedCategory, value);
        }
    };

    const visibleCategories = expandedCategories
        ? categories
        : categories.slice(0, 3);

    if (categoryLoading) {
        return <Spin spinning />;
    }

    return (
        <Sider className={styles.sidebar} width={300}>
            <div className={styles.searchSection}>
                <Search
                    enterButton
                    onSearch={onSearch}
                    placeholder="Nhập tên blog để tìm kiếm..."
                />
            </div>
            <div className={styles.menuSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>
                        Tất Cả Danh Mục
                    </span>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedCategory || '']}
                    style={{ borderRight: 0 }}
                >
                    {visibleCategories.map((category) => (
                        <Menu.Item
                            className={styles.selectedItem}
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </Menu.Item>
                    ))}
                    {categories.length > 3 && (
                        <Menu.Item className={styles.selectedItem} key="toggle">
                            <Button
                                className={styles.toggleButton}
                                onClick={() =>
                                    setExpandedCategories(!expandedCategories)
                                }
                                type="link"
                            >
                                {expandedCategories ? 'Rút gọn' : 'Thêm'}
                            </Button>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
            {!isDetailPage && (
                <>
                    <Button
                        className={styles.resetButton}
                        onClick={handleResetFilters}
                        type="link"
                    >
                        Xóa bộ lọc
                    </Button>
                    <div className={styles.divider} />
                </>
            )}
        </Sider>
    );
};

Sidebar.defaultProps = {
    setCategory: () => {},
    handleResetFilters: () => {},
    handleSearch: () => {},
    currentCategory: '',
    isDetailPage: false,
};

export default Sidebar;
