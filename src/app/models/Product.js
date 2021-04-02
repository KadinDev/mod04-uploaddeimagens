const db = require('../../config/db')

module.exports = {
    create(data) {
        const query = `
            INSERT INTO products (
                category_id,
                user_id,
                name,
                description,
                old_price,
                price,
                quantity,
                status
            ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `
        
        // R$ 1,00
        data.price = data.price.replace(/\D/g,"")
        // o valor no banco de dados será 100
        // quando for pegar esse valor pra colocar no front end pegar o valor e dividir = / 100

        const values = [
            data.category_id,
            data.user_id || 1,
            data.name,
            data.description,
            data.old_price || data.price, // a primeira vez do cadastro o old_price virá vazio mesmo, aí coloca o data.price
            data.price,
            data.quantity,
            data.status || 1 // se o status não vier automaticamente ele adiciona o 1
        ]

        return db.query(query, values)
    },

    find(id) {
        return db.query( 'SELECT * FROM products WHERE id = $1', [id] )
    },

    update(data){
        const query = `
            UPDATE products SET
                category_id=($1),
                user_id=($2),
                name=($3),
                description=($4),
                old_price=($5),
                price=($6),
                quantity=($7),
                status=($8)
            WHERE id = $9
        `

        const values = [
            data.category_id,
            data.user_id,
            data.name,
            data.description,
            data.old_price,
            data.price,
            data.quantity,
            data.status,
            data.id
        ]

        return db.query(query, values)

    },

    delete(id){
        return db.query('DELETE FROM products WHERE id = $1', [id] )
    },

    // os files do produto, fotos.
    files(id){
        return db.query(`
            SELECT * FROM files WHERE product_id = $1
        `, [id])
    }

}