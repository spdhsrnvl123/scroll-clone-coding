(() => {
    let yOffset = 0; //window.pageYOffeset 대신 쓸 변수.
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene =false; //새로운 scene이 시작된 순간 true ->쓰는 이유는 위로 스크롤이 올라갈 때 스크롤의 속도에 의해 currentScene이 변할 때 위치가 -값이 되기 때문에 이를 방지하기 위해 조건식의 변수를 만들어 준다.

    // 각 씬에 대한 정보를 담고 있는 객체.
    const sceneInfo = [
        {
            //0
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, //0으로 초기화한 이유는 휴대폰에서도 열 수도 있고 노트북에서도 열 수 있기 때문에 그거에 맞춰서 몇배수로 대응을 해야되기 때문에 고정값 사용X
            objs: { //HTMl객체 모음
                
                container: document.querySelector("#scroll-section-0"),
                //애니메이션으로 조작할 object목록
                messageA: document.querySelector('#scroll-section-0 .main-message.a'), //.main-message클래스는 다른 섹션에서도 사용하기 때문에 #scroll-section-0을 붙여준다.
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            //어느 시점에 등장시키고 빠지게 할 건지 css값을 어떤 값으로 넣을건지 정해주는 것이다.
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], //투명도가 0에서 1까지
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end:0.3 }],
            }
        },
        {
            //1
            type: 'normal',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-1")
            }
        },
        {
            //2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-2")
            }
        },
        {
            //3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-3")
            }
        }
    ];

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // console.log(sceneInfo);

        //새로고침 하였을 때 body에 정확한 id값을 넣어주기 위하여
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= pageYOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values,currentYOffset) {
        let rv;
        //현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRati = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight; //시작점
            const partScrollEnd = values[2].end * scrollHeight; //끝나는점
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv =(currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];            
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0]; //현재 씬에서 전체
        }
        //parseInt 정수값으로 변환한다.
        
        return rv;
    }

    function playAnimation() { //currentScene이 몇이냐에 따라서 분기를 해준다.
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight; //현재 씬 높이값

        // console.log(currentScene);
        // console.log(currentScene,currentYOffset);

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // let messageA_opacity_0 = values.messageA_opacity[0];
                // let messageA_opacity_1 = values.messageA_opacity[1];
                // console.log(values.messageA_opacity)
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                console.log(messageA_opacity_in);
                objs.messageA.style.opacity = messageA_opacity_in;
                // console.log(calcValues(values.messageA_opacity, currentYOffset));
                break;
            case 1:
                // console.log('1 play');
                break;
            case 2:
                // console.log('2 play');
                break;
            case 3:
                // console.log('3 play');
                break;
        }
    }

    function scrollLoop() {
        prevScrollHeight = 0; //0으로 초기화를 해줘야지 값이 누적되지 않는다.
        enterNewScene = false;
        for (let i = 0; i < currentScene;i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        } //처음에는 currentScene가 0이니까 실행이 안된다.

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            // document.body.setAttribute( 'id',`show-scene-${currentScene}`); //요기다가 하지 않는 이유는 바뀔 때만 변화하기 때문이다.
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; //바운스효과를 마이너스 취급하는 브라우저에서 -되는 효과를 방지하기 위해.
            currentScene--;
            // document.body.setAttribute('id',`show-scene-${currentScene}`); //요기다가 하지 않는 이유는 바뀔 때만 변화하기 때문이다.
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        //document.body.setAttribute('id',`show-scene-${currentScene}`); //스크롤값이 변경될 때마다 계속 실행되게 된다.
        // console.log(currentScene);
        if (enterNewScene) return; //playAnimation()함수가 실행 되지 않고 한 턴 넘어가기 위해(이상한 값이 들어가지 않기 위해)

        playAnimation(); //애니메이션을 처리하는 함수.
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset; //편의상 변수로 만들어서 쓰는 경우가 편하기 때문에 변수에 pageYOffset값을 넣어 주었다.
        // console.log(yOffset);
        scrollLoop();
    });
    window.addEventListener('load', setLayout) //웹페이지에 이미지나 리소스 싹 다 로딩이 되고 나서 실행된다.
    //window.addEventListener('DOMContentLoaded',setLayout) // HTML객체들만 로드되면 바로 실행된다.
    window.addEventListener('resize', setLayout); //창화면이 바뀌면 높이 값을 변경하기 위해.
})();
