/*
const input = document.querySelector('input[name="price"]')

// keydown é o evento de toque no teclado
input.addEventListener('keydown', function(e){
    
    setTimeout(function(){
        let { value } = e.target

        // replace / o / / é uma expressão regular
        // /\D\g = tira tudo o que não for digito, g = globalmente
        value = value.replace(/\D/g, "")

        // formatanto para REAL $
        value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)

        e.target.value = value
    }, 1) // ,1 = 1 milisegundo
    // o setTimeout vai executar tudo e ir apagando o que não for numero
})
*/


// Outra Forma
// Criando estratégia de máscara de campo
// essa func após o input, referência o formatBRL
// essa funcção pode ser aproveitada em qualquer lugar usando o exemplo criado no HTML
// this representa de forma global, dentro do input ele representa somente o input
const Mask = {
    apply(input, func){
        setTimeout(function() {
            input.value = Mask[func](input.value)
        }, 1)
    }, 

    formatBRL(value){
        value = value.replace(/\D/g, "")
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)
    }
}


// =====================================================

/*
const PhotosUpload = {

    //Quando clicar em selecionar fotos, ele coloca como files dentro do event.target, 
    //e extrai chamando ele de fileList
    

    uploadLimit: 6,

    handleFileInput(event) {
        const { files: fileList } = event.target
        const { uploadLimit } = PhotosUpload

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            
            // event para bloquear o evento e não enviar os arquivos
            event.preventDefault()
            return
        }



        // TREINAR ESSA PARTE DE BAIXO, INTERESSANTE

        // transformando o fileList em Array
        Array.from(fileList).forEach( file => {
            // new FileReader, constructor, ele permite ler arquivos
            const reader = new FileReader()

            // quando ele estiver pronto, exwcuta essa função
            reader.onload = () => {
                const image = new Image() // mesma coisa que está fazendo isso: <img />

                image.src = String(reader.result) // String só para garantir que o src seja uma string

                const div = document.createElement('div')

                div.classList.add('photo')

                div.onclick = () => alert('remove Foto')

                div.appendChild(image) // appendChild insere um elemento filho ao elemento pai
                // estou colocando a image dentro da div no createElement

                document.querySelector('#photos-preview').appendChild(div)
                // photos-preview nome da classe da div que está no body
                // e coloco o appendChild, colocando a div dentro dele 
            }


            // o momento que ele vai ficar pronto, quando ler isso aqui abaixo
            reader.readAsDataURL(file)
        })

    }
}
*/


// REFATORANDO O PhotosUpload
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    
    files: [],
    
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach( file => {

            

            PhotosUpload.files.push(file) // colocando file dentro do files acima antes do handleFileInput



            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image() // mesma coisa que está fazendo isso: <img />
                image.src = String(reader.result) // String só para garantir que o src seja uma string

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        // depois de files: [];, input, configurados, substitui esse abaixo:
        
        // PhotosUpload.getAllFiles()

        // por esse:

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList} = input

        if (fileList.length > uploadLimit) {
           
            alert(`Envie no máximo ${uploadLimit} fotos`)
            
            event.preventDefault()
            return true 
        }

        // o preview é o container todo, e o childNodes é cada div(foto) dentro do container
        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo')
            photosDiv.push(item)
        })

        // vai somar esses dois dando o total de fotos
        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert(`O limite máximo de fotos é 6!`)
            // event.preventDefault() parar evento
            event.preventDefault()
            return true
        }

        return false  
    },

    getAllFiles(){
        // new ClipboardEvent("").clipboardData - Constructor que tem no Firefox
        // new DataTransfer() - Constructor que tem no chrome
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() 

        // forEach - para cada um dos files, adiciona o dataTranfer ... (items faz parte do constructor)
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        const div = document.createElement('div')

        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image) 

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    }, 

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    }, 

    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photo">
        // parentNode = pega uma div acima dele, ou seja, a div com class photo
        
        // pegando como forma de array os elementos dentro do preview, a lista dele que é o children
        const photosArray = Array.from(PhotosUpload.preview.children)

        // procura no index o elemento photoDiv
        const index = photosArray.indexOf(photoDiv)

        // remover do index
        PhotosUpload.files.splice(index, 1)

        // atualizar o input rodando novamente a função getAllFiles()
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
        // agora essa função de remover usa-se no click de getContainer
    },

    removeOldPhoto(event){

        const photoDiv = event.target.parentNode

        // o if juntando o id='{{image.id}}' com o input "removed_files"
        if(photoDiv.id){
            const removedFiles = document.querySelector('input[name="removed_files"')
            if(removedFiles){

                // vai concatenar esse valor com o photoDiv.id
                // juntando o input com o id
                // removedFiles.value ele coloca um valor no input de removed_files
                removedFiles.value += `${photoDiv.id},` // a cada click ele coloca um id diferente
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img '),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        // pegando todas as imagens e para cada um roda essa linha, removendo o active caso alguma tenha.
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        // trocando imagem
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open(){
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = '40px'
    },
    close(){
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = '-100%'
        Lightbox.target.style.bottom = 'initial'
        Lightbox.closeButton.style.top = '-20px'
    }
}