export const contact = (data) => { 
    if(data){
        const {name, email, message} = data
        const editedMessage = `Nice to meet you, i am ${name}, and my email ${email}, ${message}`
        const encodeMessage = encodeURI(editedMessage)
        return window.location.replace(`https://api.whatsapp.com/send/?phone=6283125180658&text=${encodeMessage}&type=phone_number&app_absent=0`)
    } else {
        return window.location.replace(`https://api.whatsapp.com/send/?phone=6283125180658&text=I%20would%20like%20to%20contact%20you&type=phone_number&app_absent=0`)
    }
}