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
  const [responseUrl, setResponseUrl] = useState<{
    originalUrl: string;
    shortUrl: string;
  } | null>(null);
  const [errorUrl, setErrorUrl] = useState<{ error: string } | undefined>();

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

  // const openUrl = async (shortUrl: string) => {
  //   // Construire l'URL complète
  //   const url = `${API_HOST}/shorturl/${shortUrl}`;

  //   // Faire une requête GET à l'URL
  //   const response = await fetch(url);

  //   // Vérifier si la requête a réussi
  //   if (!response.ok) {
  //     throw new Error(`API request failed: ${response.status}`);
  //   }

  //   // response is a redirect
  //   window.location.href = response.url;
  // };

  // ---------------------------------------------------------------------------
  // Ajoutez un nouvel état pour les données d'analyse
  const [analyticsData, setAnalyticsData] = useState<
    Array<{ originalUrl: string; shortUrl: string; nbClicks: number }>
  >([]);

  const loadAnalyticsData = async () => {
    try {
      const response = await fetch(`${API_HOST}/shorturl/analytics`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load analytics data");
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const handleConsult = async (shortUrl: string) => {
    // Rediriger vers l'URL courte
    window.open(
      `${API_HOST}/shorturl/${shortUrl}`,
      "_blank",
      "noopener,noreferrer"
    );

    // Recharger les données
    await loadAnalyticsData();
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

          <a
            href={`${API_HOST}/shorturl/${responseUrl.shortUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            Consulter
          </a>
          {/* <Button onClick={() => openUrl(responseUrl.shortUrl)}>
            Consulter
          </Button> */}
          <Button onClick={onResetUrl}>Reset</Button>
        </div>
      )}
      <br />
      <table>
        <thead>
          <tr>
            <th>URL originale</th>
            <th>URL courte</th>
            <th>Nombre de clics</th>
            <th>Consulter</th>
          </tr>
        </thead>
        <tbody>
          {analyticsData
            .sort((a, b) => a.shortUrl.localeCompare(b.shortUrl))
            .map(({ originalUrl, shortUrl, nbClicks }) => (
              <tr key={shortUrl}>
                <td>{originalUrl}</td>
                <td>{shortUrl}</td>
                <td>{nbClicks}</td>
                <td>
                  <button onClick={() => handleConsult(shortUrl)}>
                    Consulter
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
