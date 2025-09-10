
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import {Form, Input, Button, Link, user}from "@heroui/react";
import { useSelector, useDispatch } from 'react-redux';
import { setFirstName, setLastName, setUserName, setEmail, setPassword, setSignedIn } from '../store/credentialsSlice'
import { create } from "domain";

export default function SignInForm({signingUp}: {signingUp: boolean}) {

    const router = useRouter();
    const [action, setAction] = useState<string | null>(null);

    // Redux state selectors and dispatcher
    const curr_firstname = useSelector((state: any) => state.cred.firstname);
    const curr_lastname = useSelector((state: any) => state.cred.lastname);
    const curr_username = useSelector((state: any) => state.cred.username);
    const curr_email = useSelector((state: any) => state.cred.email);
    const curr_password = useSelector((state: any) => state.cred.password);
    const dispatch = useDispatch();

    async function checkCredentials(email: string, password: string) {
        let result = await fetch(`http://localhost:5000/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let data: Array<any> = await result.json();
        console.log("--DATA--")
        console.log(data)
        console.log(`Email: ${email}, Password: ${password}`)
        const credentials = data.filter((user) => user.email === email && user.password === password)

        console.log("--CREDENTIALS--")
        console.log(credentials)
        if (credentials.length > 0) {
            router.push('/gallery')
            dispatch(setFirstName(credentials[0].firstname))
            dispatch(setLastName(credentials[0].lastname))
            dispatch(setUserName(credentials[0].username))
            dispatch(setEmail(credentials[0].email))
            dispatch(setPassword(credentials[0].password))
            dispatch(setSignedIn(true))
            alert("Login Successful")
        } else {
            alert("Invalid Credentials")
        }

    }

    async function createAccount(firstname: string, lastname: string, username: string, email: string, password: string) {
        await fetch(`http://localhost:5000/account_creation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstname, lastname, username, email, password })
        });
    }

    type Credentials = {
        firstname?: string;
        lastname?: string;
        username?: string;
        email: string;
        password: string;
    };

    function syncCredentials(credentials: Credentials) {
        if (signingUp) {
            createAccount(
                credentials.firstname ?? "",
                credentials.lastname ?? "",
                credentials.username ?? "",
                credentials.email,
                credentials.password
            );
            checkCredentials(credentials.email, credentials.password);
        } else {
            checkCredentials(credentials.email, credentials.password);    
        }
    }

    if (signingUp) {
        return (
            <>
                <Form
                    onReset={() => setAction("reset")}
                    onSubmit={(e) => {
                        e.preventDefault();
                        let data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log('--DATA--')
                        console.log(data)

                        let credentials = {
                            firstname: String(data.firstname),
                            lastname: String(data.lastname),
                            username: String(data.username),
                            email: String(data.email),
                            password: String(data.password)
                        }

                        syncCredentials(credentials) 
                        setAction(`submit ${JSON.stringify(data)}`);
                    }}
                >
                    <Input
                        isRequired
                        label="First Name"
                        labelPlacement="outside"
                        name="firstname"
                        placeholder="Enter your first name"
                        type="first name"
                    />
                    <Input
                        isRequired
                        label="Last name"
                        labelPlacement="outside"
                        name="lastname"
                        placeholder="Enter your last name"
                        type="last name"
                    />
                    <Input
                        isRequired
                        label="Username"
                        labelPlacement="outside"
                        name="username"
                        placeholder="Create a username"
                        type="username"
                    />
                    <Input
                        isRequired
                        errorMessage="Please enter a valid email"
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                    />
                    <Input
                        isRequired
                        errorMessage="Please enter a valid password"
                        label="Password"
                        labelPlacement="outside"
                        name="password"
                        placeholder="Enter a strong password"
                        type="password"
                    />
                    <Button type="submit" variant="flat">
                        Sign Up
                    </Button>
                </Form>
            </>
        ) 
    }
    return (
        <>
            <Form
                onReset={() => setAction("reset")}
                onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));

                    let credentials = {
                        email: String(data.email),
                        password: String(data.password)
                    } 

                    syncCredentials(credentials)

                    setAction(`submit ${JSON.stringify(data)}`);
                }}
            >
                <Input
                    isRequired
                    errorMessage="Invalid Password or Email Address"
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                />
                <Input
                    isRequired
                    errorMessage="Invalid Password or Email Address"
                    label="Password"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                />
                <Button type="submit" variant="flat">
                    Login
                </Button>
            </Form>
        </>
    )
}