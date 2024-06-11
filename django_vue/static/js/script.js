document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const simpleSearchButton = document.getElementById('simpleSearch');
    const deepSearchButton = document.getElementById('deepSearch');
    const researchSearchButton = document.getElementById('researchSearch');
    const resultsContainer = document.getElementById('results');
    const loadingContainer = document.getElementById('loading');
    const sectionsSimple = document.getElementById('sections-simple');
    const sectionsDeep = document.getElementById('sections-deep');
    const sectionsResearch = document.getElementById('sections-research');

    function displayResults(data, sectionIds) {
        loadingContainer.style.display = 'none'; // 隐藏加载特效
        resultsContainer.style.display = 'block'; // 显示结果容器
        resultsContainer.innerHTML = ''; // 清空之前的结果

        if (data) {
            sectionIds.forEach((sectionId, index) => {
                const content = document.getElementById(sectionId);
                if (content) {
                    content.style.display = 'block';
                    // 直接输出内容
                    content.textContent = data[index];
                }
            });
        } else {
            resultsContainer.textContent = '没有找到相关结果。';
        }
    }

    async function handleSearch(searchType) {
        const query = searchInput.value.trim();
        if (query) {
            resultsContainer.style.display = 'none'; // 隐藏结果容器
            loadingContainer.style.display = 'block'; // 显示加载特效
            sectionsSimple.style.display = 'none'; // 隐藏所有目录层次结构
            sectionsDeep.style.display = 'none'; // 隐藏所有目录层次结构
            sectionsResearch.style.display = 'none'; // 隐藏所有目录层次结构

            let endpoints;
            let sectionIds;

            if (searchType === '观影前') {
                endpoints = ['/api/send_1/', '/api/send_2/', '/api/send_3/'];
                sectionIds = ['simple-background', 'simple-summary', 'simple-cast'];
            } else if (searchType === '观影中') {
                endpoints = ['/api/send_4/', '/api/send_5/'];
                sectionIds = ['deep-analysis', 'deep-scenes'];
            } else if (searchType === '观影后') {
                endpoints = ['/api/send_6/', '/api/send_7/'];
                sectionIds = ['research-review', 'research-impact'];
            }

            try {
                const results = await Promise.all(
                    endpoints.map(endpoint =>
                        fetch(endpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ prompt: query })
                        }).then(response => response.json())
                    )
                );

                const data = results.map(result => result.data);
                displayResults(data, sectionIds);

                if (searchType === '观影前') {
                    sectionsSimple.style.display = 'block'; // 显示对应的目录层次结构
                } else if (searchType === '观影中') {
                    sectionsDeep.style.display = 'block'; // 显示对应的目录层次结构
                } else if (searchType === '观影后') {
                    sectionsResearch.style.display = 'block'; // 显示对应的目录层次结构
                }
            } catch (error) {
                console.error('Error:', error);
                resultsContainer.style.display = 'block';
                loadingContainer.style.display = 'none';
                resultsContainer.textContent = '查询过程中发生错误。';
            }
        } else {
            alert('请输入查询内容');
        }
    }

    simpleSearchButton.addEventListener('click', () => handleSearch('观影前'));
    deepSearchButton.addEventListener('click', () => handleSearch('观影中'));
    researchSearchButton.addEventListener('click', () => handleSearch('观影后'));

    // 目录展开/收起功能
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    });
});
