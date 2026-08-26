window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>菜价计算器</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#22c55e',
                    },
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer utilities {
            .card-shadow {
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            }
            .input-no-border {
                border: none !important;
                outline: none !important;
            }
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen pb-24">
    <div class="max-w-lg mx-auto px-4 py-6">
        <!-- 头部 -->
        <div class="bg-primary text-white rounded-xl p-5 card-shadow mb-4">
            <h1 class="text-xl font-bold flex items-center gap-2">
                <i class="fa fa-shopping-basket"></i>
                菜价计算器
            </h1>
            <p class="text-white/80 text-sm mt-1">录入菜品单价和重量，自动计算总价</p>
        </div>

        <!-- 顶部按钮组：添加菜品 + 清空全部 -->
        <div class="flex gap-3 mb-4">
            <button id="addBtn" class="flex-1 bg-white border border-primary text-primary py-3 rounded-xl font-medium card-shadow flex items-center justify-center gap-2 active:bg-green-50">
                <i class="fa fa-plus-circle"></i> 添加菜品
            </button>
            <button id="clearAllBtn" class="bg-white border border-red-400 text-red-500 py-3 px-4 rounded-xl font-medium card-shadow active:bg-red-50">
                <i class="fa fa-trash"></i> 清空
            </button>
        </div>

        <!-- 表头 -->
        <div class="grid grid-cols-12 gap-2 text-sm text-gray-500 font-medium mb-2 px-1">
            <div class="col-span-4">菜品</div>
            <div class="col-span-2">单价</div>
            <div class="col-span-2">重量</div>
            <div class="col-span-3">小计</div>
            <div class="col-span-1"></div>
        </div>

        <!-- 菜品列表容器 -->
        <div id="list" class="space-y-3">
        </div>

        <!-- 合计区域 -->
        <div class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
            <div class="max-w-lg mx-auto flex justify-between items-center">
                <div class="text-gray-600">全部合计</div>
                <div id="totalAll" class="text-2xl font-bold text-primary">0.00 元</div>
            </div>
        </div>
    </div>

    <script>
        const STORAGE_KEY = "caijia_data";
        const listEl = document.getElementById('list');
        const totalAllEl = document.getElementById('totalAll');
        const addBtn = document.getElementById('addBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');

        // 读取本地保存的数据
        function loadData() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if(raw){
                return JSON.parse(raw);
            }
            return [];
        }
        // 保存数据到本地
        function saveData(data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        let dataList = loadData();

        // 渲染整列表
        function renderList(){
            listEl.innerHTML = '';
            dataList.forEach((item, index)=>{
                createRow(item, index);
            })
            calcTotalAll();
        }

        // 创建一行菜品（输入框去掉边框）
        function createRow(data={}, index) {
            const div = document.createElement('div');
            div.className = 'grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl card-shadow';
            div.innerHTML = `
                <input type="text" class="name col-span-4 input-no-border rounded-lg px-2 py-2 bg-gray-50" placeholder="菜名" value="${data.name || ''}">
                <input type="number" step="0.01" class="price col-span-2 input-no-border rounded-lg px-2 py-2 bg-gray-50" placeholder="单价" value="${data.price || ''}">
                <input type="number" step="0.001" class="weight col-span-2 input-no-border rounded-lg px-2 py-2 bg-gray-50" placeholder="重量" value="${data.weight || ''}">
                <div class="sub col-span-3 font-semibold text-gray-700">0.00</div>
                <button class="del col-span-1 text-red-500 text-lg"><i class="fa fa-times-circle"></i></button>
            `;

            const nameInput = div.querySelector('.name');
            const priceInput = div.querySelector('.price');
            const weightInput = div.querySelector('.weight');
            const subEl = div.querySelector('.sub');
            const delBtn = div.querySelector('.del');

            // 计算单行小计
            function calcSub() {
                const p = Number(priceInput.value) || 0;
                const w = Number(weightInput.value) || 0;
                const sub = (p * w).toFixed(2);
                subEl.textContent = sub;
                // 更新数据数组并保存
                dataList[index].name = nameInput.value;
                dataList[index].price = p;
                dataList[index].weight = w;
                saveData(dataList);
                calcTotalAll();
            }
            nameInput.addEventListener('input', calcSub);
            priceInput.addEventListener('input', calcSub);
            weightInput.addEventListener('input', calcSub);
            // 初始化计算
            calcSub();

            // 删除该行
            delBtn.onclick = () => {
                dataList.splice(index,1);
                saveData(dataList);
                renderList();
            };
            listEl.appendChild(div);
        }

        // 新增空行
        function addNewRow(){
            dataList.push({name:'',price:0,weight:0});
            saveData(dataList);
            renderList();
        }

        // 计算全部总和
        function calcTotalAll() {
            let sum = 0;
            dataList.forEach(item=>{
                sum += Number((item.price * item.weight).toFixed(2));
            })
            totalAllEl.textContent = sum.toFixed(2) + ' 元';
        }

        // 清空全部
        clearAllBtn.onclick = function(){
            if(confirm("确定要清空所有菜品记录吗？")){
                dataList = [];
                saveData(dataList);
                renderList();
            }
        }

        addBtn.onclick = addNewRow;
        // 初始化渲染
        renderList();
    </script>
</body>
</html>
