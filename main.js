(() => {
    let yOffset = 0; //window.pageYOffeset 대신 쓸 변수.
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; //새로운 scene이 시작된 순간 true ->쓰는 이유는 위로 스크롤이 올라갈 때 스크롤의 속도에 의해 currentScene이 변할 때 위치가 -값이 되기 때문에 이를 방지하기 위해 조건식의 변수를 만들어 준다.

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
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.2, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9}],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            }
        },
        {
            //1
            type: 'normal', //type normal에서는 필요 없음
            //heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-1"),
                content:document.querySelector('#scroll-section1 .description')
            }
        },
        {
            //2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-2"),
                messageA: document.querySelector("#scroll-section-2 .a"),
                messageB: document.querySelector("#scroll-section-2 .b"),
                messageC: document.querySelector("#scroll-section-2 .c"),
                pinB: document.querySelector("#scroll-section-2 .b .pin"),
                pinC : document.querySelector("#scroll-section-2 .c .pin")
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, {start:0.85, end:0.9}]
            }
        },
        {
            //3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-3"),
                canvasCaption: document.querySelector('.cavas-caption')
            }
        }
    ];

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++){
            if (sceneInfo[i].type === 'sticky') { //type별로 높이 값 세팅
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
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
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight; //시작점
            const partScrollEnd = values[2].end * scrollHeight; //끝나는점
            const partScrollHeight = partScrollEnd - partScrollStart;
            
            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv =(currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];            
            } else if (currentYOffset < partScrollStart) { //애니메이션 재생구간 미 도달 시 values[0];
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) { //애니메이션 재생구간 초과 시 values[1];
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0]; //현재 씬에서 전체 비율을 계산
        }
        //parseInt 정수값으로 변환한다.
        return rv;
    }

    function playAnimation() { //currentScene이 몇이냐에 따라서 분기를 해준다.
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight; //현재 씬 높이값
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; //스크롤 비율에 따라서 in을 적용할꺼냐 out을 적용할꺼냐 하기 위해


        
        // console.log(currentScene);
        // console.log(currentScene,currentYOffset);

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // let messageA_opacity_0 = values.messageA_opacity[0];
                // let messageA_opacity_1 = values.messageA_opacity[1];
                // console.log(values.messageA_opacity)

                // const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                // const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                // const messageA_translateY_in = calcValues(values.messageA_opacity_in, currentYOffset);
                // const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);

                //translate3d를 쓴 이유는 하드웨어 가속이 보장이된다.(translateY로 사용해도 상관없다.)

                if (scrollRatio <= 0.22) {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in, currentYOffset)}%,0)`;
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_out, currentYOffset)}%,0)`;
                } 
                if (scrollRatio <= 0.42) {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_in, currentYOffset)}%,0)`;
                } else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_out,currentYOffset)}%,0)`
                }
                if (scrollRatio <= 0.62) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0,${calcValues(values.messageC_translateY_in,currentYOffset)}%,0)`
                } else {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.82) {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0,${calcValues(values.messageD_translateY_in, currentYOffset)}%,0)`;
                } else {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0,${calcValues(values.messageD_translateY_out, currentYOffset)}$,0)`;
                }
                // objs.messageA.style.opacity = messageA_opacity_in;
                // console.log(calcValues(values.messageA_opacity, currentYOffset));
                break;
            case 1:
                // console.log('1 play');

                break;
            case 2:
                // console.log('2 play');
                if (scrollRatio <= 0.25) {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                 if (scrollRatio <= 0.57) {
                // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
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
