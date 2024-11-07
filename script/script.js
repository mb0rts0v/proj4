document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    const modalDialog = document.querySelector('.modal-dialog');

    let clientWidth = document.documentElement.clientWidth;
    let numberQuestion = 0;
    let answersData = [];
    let count = -100;

    if (clientWidth < 768) {
        burgerBtn.style.display = "flex";
    } else {
        burgerBtn.style.display = 'none';
    }

    const questions = [
        {
            question: "Якого кольору бургер?",
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чорний', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                { title: 'Курка', url: './image/chickenMeat.png' },
                { title: 'Яловичина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: "Додаткові інгредієнти?",
            answers: [
                { title: 'Помідор', url: './image/tomato.png' },
                { title: 'Огірок', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Цибуля', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: "Додати соус?",
            answers: [
                { title: 'Часниковий', url: './image/sauce1.png' },
                { title: 'Томатний', url: './image/sauce2.png' },
                { title: 'Гірчичний', url: './image/sauce3.png' }
            ],
            type: 'radio'
        },
        {
            question: "Введіть свій номер телефону",
            answers: [],
            type: 'text'
        }
    ];

    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count += 4;
        if (count < 0) {
            requestAnimationFrame(animateModal);
        } else {
            count = -100;
        }
    };

    const renderAnswers = (index) => {
        formAnswers.innerHTML = '';
        if (questions[index].type === 'text') {
            formAnswers.innerHTML = `
                <input type="tel" id="phoneNumber" name="phone" placeholder="Введіть номер телефону" class="form-control mb-3">
                <button id="submitPhone" class="btn btn-primary">Відправити</button>
            `;
            document.querySelector('#submitPhone').addEventListener('click', () => {
                const phoneInput = document.querySelector('#phoneNumber').value;
                if (phoneInput) {
                    answersData.push({ question: questions[index].question, answer: phoneInput });
                    alert("Ваші відповіді були надіслані!");
                    modalBlock.classList.remove('d-block');
                    burgerBtn.classList.remove('active');
                    resetQuiz();
                }
            });
        } else {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="burger">
                        <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            });
        }
    };

    const renderQuestions = (indexQuestion) => {
        questionTitle.textContent = questions[indexQuestion].question;
        renderAnswers(indexQuestion);

        switch (indexQuestion) {
            case 0:
                prevButton.classList.add('hidden');
                nextButton.classList.remove('hidden');
                sendButton.classList.add('d-none');
                break;
            case questions.length - 1:
                nextButton.classList.add('hidden');
                prevButton.classList.remove('hidden');
                sendButton.classList.remove('d-none');
                break;
            default:
                prevButton.classList.remove('hidden');
                nextButton.classList.remove('hidden');
                sendButton.classList.add('d-none');
                break;
        }
    };

    const saveAnswer = () => {
        const selectedAnswers = [...formAnswers.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked')];
        const answerTitles = selectedAnswers.map(answer => answer.value);
        answersData[numberQuestion] = answerTitles;
    };

    const submitAnswers = () => {
        alert("Ваші відповіді були надіслані!");
        modalBlock.classList.remove('d-block');
        resetQuiz();
    };

    const resetQuiz = () => {
        answersData = [];
        numberQuestion = 0;
        playTest();
    };

    const playTest = () => {
        renderQuestions(numberQuestion);

        nextButton.onclick = () => {
            saveAnswer();
            if (numberQuestion < questions.length - 1) {
                numberQuestion++;
                renderQuestions(numberQuestion);
            }
        };

        prevButton.onclick = () => {
            if (numberQuestion > 0) {
                numberQuestion--;
                renderQuestions(numberQuestion);
            }
        };

        sendButton.onclick = () => {
            saveAnswer();
            submitAnswers();
        };
    };

    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        playTest();
    });

    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
        resetQuiz();
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.modal-dialog') && !event.target.closest('.openModalButton') && !event.target.closest('.burger')) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
            resetQuiz();
        }
    });

    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }
    });
});
