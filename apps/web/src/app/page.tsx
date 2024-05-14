"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@repo/ui/button";
import { env } from "../env";

const API_HOST = env.api.url || "http://localhost:5555/api";

export default function Web() {
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setResponse(null);
    setError(undefined);
  }, [name]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await fetch(`${API_HOST}/message/${name}`);
      const response = await result.json();
      setResponse(response);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch response");
    }
  };

  const onReset = () => {
    setName("");
  };

  //--------------------------------------------------------------------------------
  const [url, setUrl] = useState<string>("");
  const [responseUrl, setResponseUrl] = useState<{ originalUrl: string; shortUrl: string } | null>(null);
  const [errorUrl, setErrorUrl] = useState<{ error: string; } | undefined>();

  useEffect(() => {
    setResponseUrl(null);
    setErrorUrl(undefined);
  }, [url]);

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  const onSubmitUrl = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await fetch(`${API_HOST}/shorturl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const responseUrl = await result.json();
      setResponseUrl(responseUrl);
    } catch (err) {
      console.error(err);
      setErrorUrl(err as { error: string }); // "Unable to fetch response"
    }
  };

  const onResetUrl = () => {
    setUrl("");
  };

  return (
    <div>
      <h1>Web</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={onChange}
        ></input>
        <Button type="submit">Submit</Button>
      </form>
      {error && (
        <div>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div>
          <h3>Greeting</h3>
          <p>{response.message}</p>
          <Button onClick={onReset}>Reset</Button>
        </div>
      )}
      <h1>URRL</h1>
      <form onSubmit={onSubmitUrl}>
        <label htmlFor="url">URL </label>
        <input
          type="text"
          name="url"
          id="url"
          value={url}
          onChange={onChangeUrl}
        ></input>
        <Button type="submit">Submit</Button>
      </form>
      {errorUrl && (
        <div>
          <h3>Error</h3>
          <p>{errorUrl.error}</p>
        </div>
      )}
      {responseUrl && (
        <div>
          <p>originalUrl: {responseUrl.originalUrl}</p>
          <p>shortUrl: {responseUrl.shortUrl}</p>
          <Button onClick={onResetUrl}>Reset</Button>
        </div>
      )}
    </div>
  );
}
