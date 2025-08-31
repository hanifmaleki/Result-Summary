window.onload = () => {
    Promise.all([loadTranslation('en'), loadCategories()])
        .then(([translations, categoriesData]) => {
            new App(translations, categoriesData)
        })
}

async function loadTranslation(lang) {
    const res = await fetch(`./js/translate-${lang}.json`)

    return await res.json()
}

async function loadCategories() {
    const res = await fetch('./js/data.json')

    return await res.json()
}

function trans(message, parameters) {
    return message.replace(/\{(\w+)\}/g, (_, key) => parameters[key] ?? '')
}

class App {
    constructor(translations, categoriesData) {
        this.translations = translations
        this.categoriesData = categoriesData

        this.initializeAppTranslations()
        this.initialCategories()
    }

    initialCategories() {
        const categoryElements = document.querySelectorAll('.category-container')

        let sumOfCategoryScores = 0
        let categoryCount = 0

        categoryElements.forEach(element => {
            const categoryData = this.categoriesData.find(item => item.category === element.id)
            new Category(element, categoryData, this.translations)
            sumOfCategoryScores += categoryData.score
            categoryCount++
        })

        const resultScore = Math.floor(sumOfCategoryScores / categoryCount)
        document.querySelector('#resultScore').textContent = resultScore

        // Later translations
        document.querySelector('.quality-title').textContent = this.translations.quality_title
        document.querySelector('.quality-description').textContent = trans(this.translations.quality_description, {percent: 66})
    }

    initializeAppTranslations() {
        document.querySelector('title').textContent = this.translations.title
        document.querySelector('h1').textContent = this.translations.your_result
        document.querySelector('.result-upper-bound').textContent = this.translations.of_100_text
        document.querySelector('.summary-title').textContent = this.translations.summary
        document.querySelector('#continueButton').textContent = this.translations.continue
    }
}

class Category {
    constructor(element, categoryData, translations) {
        this.element = element
        this.translations = translations
        this.categoryData = categoryData
        this.category = categoryData.category
        const img = document.createElement('img')
        img.src = categoryData.icon 
        img.alt = categoryData.category
        element.querySelector('.category-icon').appendChild(img)
        element.querySelector('.category-point').textContent = categoryData.score
        this.element.style.color = categoryData.color
        this.element.style.backgroundColor = categoryData.backgroundColor 

        this.translate()
    }

    translate() {
        this.element.querySelector('.category-title').textContent = this.translations[this.categoryData.category]
        this.element.querySelector('.category-maximum').textContent = this.translations.of_100_sign
    }
}
