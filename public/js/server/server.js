class Server{
    constructor(HOST) {
        this.HOST = HOST;
    }

    async postData(data, url) {
        let response = await fetch(`${this.HOST}${url}`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        return await response.json();
    }

    addPolynomials(polynomials) {
        return this.postData(polynomials, '/poly/sum');
    }

    subPolynomials(polynomials) {
        return this.postData(polynomials, '/poly/sub');
    }

    multPolynomials(polynomials) {
        return this.postData(polynomials, '/poly/mult');
    }
}