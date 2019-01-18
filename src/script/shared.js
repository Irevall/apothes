export default {
    urlify: function(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank">link</a>`;
        });
    },
    dateFormat: function(date) {
        date = new Date(date);
        return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}, ${('0' + date.getDate()).slice(-2)}/${('0' + date.getMonth() + 1).slice(-2)}/${date.getFullYear()}`;
    },
    download: function(id) {
        console.log('downloaded!');
    }
}