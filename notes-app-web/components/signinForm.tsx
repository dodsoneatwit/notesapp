
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import {Form, Input, Button, Link, user}from "@heroui/react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword } from '../store/credentialsSlice'
import { create } from "domain";

export default function SignInForm({signingUp}: {signingUp: boolean}) {



    const router = useRouter();
    const [action, setAction] = useState<string | null>(null);
    const curr_email = useSelector((state: any) => state.cred.email);
    const curr_password = useSelector((state: any) => state.cred.password);
    const dispatch = useDispatch();

    async function checkCredentials(email: string, password: string) {
        let result = await fetch(`http://localhost:5000/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ email,password }),
        });
        let data: Array<any> = await result.json();
        console.log("--DATA--")
        console.log(data)
        
        const credentials = data.filter((user) => user.email === email && user.password === password)
        if (credentials.length > 0) {
            router.push('/gallery')
            dispatch(setEmail(email))
            dispatch(setPassword(password))
        } else {
            alert("Invalid Credentials")
        }

    }

    async function createAccount(firstname: string, lastname: string, username: string, email: string, password: string) {
        let result = await fetch(`http://localhost:5000/account_creation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstname, lastname, username, email, password })
        });
    }

    function syncCredentials(email: string, password: string, firstname: string = "null", lastname: string = "null", username: string = "null") {
        if (signingUp) {
            createAccount(email, password, firstname, lastname, username)
            checkCredentials(email, password)
        }
        checkCredentials(email, password)
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
                        syncCredentials(
                            String(data.email), String(data.password), String(data.firstname), String(data.lastname), String(data.username)
                        )

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
                        <Link href="../gallery">Sign Up</Link>
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

                    syncCredentials(String(data.email), String(data.password))

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