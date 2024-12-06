import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from "./ArticleCard";
import ArticleCard2 from "./ArticleCard2";
import bmc from "../../../bmc-button.png";
import {Select, Space, Button, Spin} from 'antd';
import Search from "antd/es/input/Search";
import {PhoneOutlined} from '@ant-design/icons';
import {Helmet} from "react-helmet";



function Articles() {
    const [articles, setArticles] = useState([]);
    const [themes, setThemes] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [searchKey, setSearchKey] = useState(0);
    const [loading, setLoading] = useState(false);


    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetchArticles();

        axios.get(`${apiUrl}/themes/en`)
            .then(response => {
                setThemes(response.data.map(theme => ({ value: theme, label: theme }))); // Assuming each theme has an id and name
            })
            .catch(error => {
                console.error('Error fetching the themes', error);
            });

    }, []);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const fetchArticles = async (themes = [], searchTerm = '') => {
        let url = `${apiUrl}/articles`;
        console.log("fetch new articles")
        setLoading(true);

        await sleep(100000);

        if (searchTerm) {
            url += `/searchTerm/${searchTerm}`; // Endpoint for searching by term
            console.log("searched term")
        } else if (themes.length > 0) {
            url += `/themes/${themes.join(',')}`; // Join themes for the URL
            console.log(
                "themes"
            )
        } else {
            url += "/published"
        }

        axios.get(url)
            .then(response => {
                const sortedArticles = response.data.sort((a, b) => {
                    if (a.theme === "Welcome" && b.theme !== "Welcome") {
                        return -1;
                    }
                    if (a.theme !== "Welcome" && b.theme === "Welcome") {
                        return 1;
                    }
                    if (a.theme === "Pinned" && b.theme !== "Pinned") {
                        return -1;
                    }
                    if (a.theme !== "Pinned" && b.theme === "Pinned") {
                        return 1;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setArticles(sortedArticles);
            })
            .catch(error => {
                setArticles([]);
            })
            .finally(() => {
                setLoading(false); // End loading
            });
    };


    const handleChange = (selectedThemes) => {
        setSelectedThemes(selectedThemes);
        setSearchKey(prevKey => prevKey + 1);
        fetchArticles(selectedThemes);
    };

    const onSearch = (searchTerm) => {
        setSelectedThemes([]); // Deselect any selected themes
        fetchArticles([], searchTerm); // Fetch articles based on the search term
    };


    return (
        <div className="flex flex-col justify-center md:flex-row items-start py-6 px-4 gap-8">
            <Helmet>
                <title>
                    Oxy-vitale - Articles
                </title>
            </Helmet>
            <div className="flex-col w-11/12 ml-4 md:ml-0 md:mr-4 lg:mr-8 md:w-3/5 lg:w-3/5 max-w-2xl">

                {loading ? (
                    <div className="flex h-screen">
                        <Spin size="large" tip="Un instant, s'il vous plaît" />
                    </div>
                ) : (
                    articles.map((article, index) => (
                        <div className="mb-6" key={index}>
                            <ArticleCard2 article={article} />
                        </div>
                    ))
                )}
            </div>
            <div className="w-full md:w-72 md:border-l-2 border-gray-300 pl-4 md:sticky top-0 md:text-right order-first md:order-last mb-6 md:mb-0">
                <Space direction={"vertical"} size={"middle"}>
                    <Search key={searchKey} placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />
                    <Select
                        mode="multiple"
                        style={{ width: 200, textAlign: "left"}}
                        placeholder="Select topics"
                        onChange={handleChange}
                        options={themes}
                    />
                    <a href="/#contact">
                        <Button type="primary" ghost={true}  size={"large"} shape="round" color={"blue"} icon={<PhoneOutlined />}>Contactez-nous</Button>
                    </a>
                </Space>
            </div>
        </div>
    );

}

export default Articles;
