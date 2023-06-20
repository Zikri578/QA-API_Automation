// meng-import modul supertest serta url yang akan digunakan
const request = require("supertest")("https://kasir-api.belajarqa.com");
// meng-import modul chai untuk menampilkan expected / hasil yang diharapkan
const expect = require("chai").expect;

// melakukan pengujian Test case dengan judul "Authorization"
describe("Authorization", function () {
    it("Positif Case - Registration Berhasil", async function () {
        const response = await request
            .post("/registration")
            .send({
                "name": "Zikri",
                "email": "zikri@gmail.com",
                "password": "hahahah"
            });

        console.log(response.body);
        expect(response.status).to.eql(201);
        expect(response.body.data.name).to.eql("Zikri");
        expect(response.body.data.email).to.eql("zikri@gmail.com");
    });

    it("Negatif Case - Registration Gagal", async function () {
        const response = await request
            .post("/registration")
            .send({
                "name": "Picarro",
                "email": "picarro@gmail.com",
                "password": "picaro"
            });

        expect(response.status).to.eql(401);
        expect(response.body.data.name).to.eql("name");
        expect(response.body.data.email).to.eql("picarro@gmail.com");
    });
});

// melakukan pengujian Test case dengan judul "Login"
describe("Login", function () {
    it("Positif Case - Login Berhasil", async function () {
        const response = await request
            .post("/authentications")
            .send({
                "email": "zikri@gmail.com",
                "password": "hahahah"
            })

        console.log(response.body);
        expect(response.status).to.eql(201);
        expect(response.body.data.user.email).to.eql("zikri@gmail.com");

        // membuat sebuah token
        token = response.body.data.accessToken;
        console.log("Access Token : ", token);
    });

    it("Negatif Case - Login Gagal", async function () {
        const response = await request
            .post("/authentications")
            .send({
                "email": "picarro@gmail.com",
                "password": "picaro"
            })
        expect(response.status).to.eql(201);
        expect(response.body.data.user.email).to.eql("picasso@gmail.com");
    })
});

// melakukan pengujian Test case dengan judul "Create User"
describe("Create User", function () {
    it("Positif Case - User Berhasil Dibuat", async function () {
        const response = await request
            .post("/users")
            .send({
                "name": "kasir-serbaguna",
                "email": "user@example.com",
                "password": "jiasda2321@"
            })
            .set({
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            });

        console.log(response.body);
        expect(response.status).to.eql(201);
        expect(response.body.data.name).to.eql("kasir-serbaguna");

        // membuat sebuah user ID
        user_id = response.body.data.userId;
        console.log("User ID : ", user_id);
    });

    it("Negatif Case - User Gagal Dibuat", async function () {
        const request = await request
            .post("/users")
            .send({
                "name": "kasir-cibaduyut",
                "email": "kasircibaduyut@mail.com",
                "password": "qrwetwe"
            })
            .set({
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            })

        expect(response.status).to.eql(203);
        expect(response.body.data.name).to.eql("kasir-kasihsayang");
    })
});

// melakukan pengujian Test case dengan judul "Update User"
describe("Update User", function () {
    it("Positif Case - User Berhasil Di Update", async function () {
        const response = await request
            .put(`/users/${user_id}`)
            .send({
                "name": "Alexander",
                "email": "alexander@example.com",
                "password": "@alexander"
            })
            .set({
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            })

        console.log(response.body);
        expect(response.status).to.eql(200);
        expect(response.body.data.name).to.eql("Alexander");
    });

    it("Negatif Case - User Gagal Di Update", async function () {
        const response = await request
            .put(`/users/${user_id}`)
            .send({
                "email": "fatahillah@example.com",
                "password": "@fatahillah"
            })
            .set({
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            })

        expect(response.status).to.eql(500);
        expect(response.body.data.email).to.eql("fatahillah@example.com");
    })
});

// melakukan pengujian Test case dengan judul "Get User List"
describe("Get User List", function () {
    it("Positif Case - User List Berhasil Ditampilkan", async function () {
        const response = await request
            .get("/users")
            .set({
                Authorization: `Bearer ${token}`
            })

        console.log(JSON.stringify(response.body));

        expect(response.status).to.eql(200);
        expect(JSON.stringify(response.body.data.users));
    });

    it("Negatif Case - User List Gagal Ditampilkan", async function () {
        const response = await request
            .get("/users")
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).to.eql(409);
        expect(JSON.stringify(response.body.data));
    });
});

// melakukan pengujian Test case dengan judul "Get User Detail"
describe("Get User Detail", function () {
    it("Positif Case - User Detail Berhasil Di Tampilkan", async function () {
        const response = await request
            .get(`/users/${user_id}`)
            .send({
                "name": "Alexander",
                "email": "alexander@example.com"
            })
            .set({
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            })

        console.log(response.body);
        expect(response.status).to.eql(200);
        expect(response.body.data.user.name).to.eql("Alexander");
        expect(response.body.data.user.email).to.eql("alexander@example.com");
    });

    it("Negatif Case - User Detail Gagal Di Tampilkan", async function () {
        const response = await request
            .get(`/users/${user_id}`)
            .send({
                "name": "pizza",
                "email": "pizza@example.com"
            })
            .set({
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            })

        expect(response.status).to.eql(200);
        expect(response.body.data.user.name).to.eql("wahyudi");
        expect(response.body.data.user.email).to.eql("wahyudi@example.com");
    })
});

// melakukan pengujian Test case dengan judul "Del User Detail"
describe("Del User Detail", function () {
    it("Positif Case - User Detail Berhasil Di Hapus", async function () {
        const response = await request
            .del(`/users/${user_id}`)
            .set({
                Authorization: `Bearer ${token}`,
            })

        console.log(response.body);
        expect(response.status).to.eql(200);
        expect(response.body.message).to.eql("User berhasil dihapus");
    });

    it("Negatif Case - User Detail Gagal Di Hapus", async function () {
        const response = await request
            .del(`/users/${user_id}`)
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).to.eql(404);
        expect(response.body.error).to.eql("User tidak ditemukan");
    })
});
