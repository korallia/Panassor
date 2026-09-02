import { useEffect, useState } from "react";

import {
  getShipmentTrackingEntry,
  submitShipmentTrackingEntry,
} from "../../backend/panassorApi";

// Internal-only utility page, not part of the storefront: Korallia opens
// this from the link in the Discord "new order" notification to enter a
// carrier + tracking number for a shipment. No login -- access is the
// admin_access_token in the URL (?key=), same idea as the /merci page's
// order-lookup key. Deliberately plain/functional rather than matching
// the site's dark theme -- nobody but her ever sees it.

function getTrackingEntryAccessFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return {
    shipmentId: params.get("shipmentId"),
    key: params.get("key"),
  };
}

const CARRIER_OPTIONS = [
  { value: "postes_canada", label: "Postes Canada" },
  { value: "purolator", label: "Purolator" },
];

function ShipmentTrackingEntryPage() {
  const { shipmentId, key } = getTrackingEntryAccessFromUrl();

  const [status, setStatus] = useState("loading"); // loading | ready | missing-access | error
  const [entry, setEntry] = useState(null);
  const [carrier, setCarrier] = useState("postes_canada");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | done | error
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!shipmentId || !key) {
      setStatus("missing-access");
      return;
    }

    getShipmentTrackingEntry(shipmentId, key)
      .then((result) => {
        setEntry(result);
        if (result.carrier) setCarrier(result.carrier);
        if (result.trackingNumber) setTrackingNumber(result.trackingNumber);
        if (result.trackingUrl) setTrackingUrl(result.trackingUrl);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!trackingNumber.trim()) {
      setSubmitError("Le numéro de tracking est requis.");
      return;
    }

    setSubmitState("submitting");
    setSubmitError("");

    try {
      const result = await submitShipmentTrackingEntry(shipmentId, key, {
        carrier,
        trackingNumber: trackingNumber.trim(),
        trackingUrl: trackingUrl.trim() || undefined,
      });

      setEntry((current) => ({ ...current, ...result }));
      setSubmitState("done");
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error?.message === "TRACKING_SAVED_EMAIL_FAILED"
          ? "Le tracking a été sauvegardé, mais l'envoi du courriel a échoué -- réessaie."
          : "Une erreur est survenue, réessaie."
      );
    }
  }

  const containerStyle = {
    maxWidth: 480,
    margin: "48px auto",
    padding: "0 20px",
    fontFamily: "system-ui, sans-serif",
    color: "#1a1a1a",
  };

  if (status === "loading") {
    return <div style={containerStyle}>Chargement…</div>;
  }

  if (status === "missing-access" || status === "error") {
    return (
      <div style={containerStyle}>
        <p>Lien invalide ou expédition introuvable.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>
        Commande #{entry.orderId}
      </h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        {entry.recipientDisplayName}
      </p>

      {entry.items?.length > 0 && (
        <ul style={{ fontSize: 14, color: "#333", paddingLeft: 18 }}>
          {entry.items.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.name}
              {item.colorName ? ` (${item.colorName})` : ""}
            </li>
          ))}
        </ul>
      )}

      {entry.trackingEmailSentAt && submitState !== "done" && (
        <p style={{ fontSize: 13, color: "#8a6d00", background: "#fff8e1", padding: "8px 12px", borderRadius: 4 }}>
          Un courriel de tracking a déjà été envoyé pour cette commande le{" "}
          {new Date(entry.trackingEmailSentAt).toLocaleString("fr-CA")}. Soumettre
          ce formulaire en renverra un nouveau.
        </p>
      )}

      {submitState === "done" ? (
        <p style={{ fontSize: 15, color: "#1a7a1a", marginTop: 20 }}>
          ✔ Tracking sauvegardé et courriel envoyé à {entry.recipientDisplayName}.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Transporteur
            </span>
            <select
              value={carrier}
              onChange={(event) => setCarrier(event.target.value)}
              style={{ width: "100%", padding: 8, fontSize: 15 }}
            >
              {CARRIER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Numéro de tracking
            </span>
            <input
              type="text"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              style={{ width: "100%", padding: 8, fontSize: 15, boxSizing: "border-box" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Lien de tracking (optionnel -- généré automatiquement sinon)
            </span>
            <input
              type="text"
              value={trackingUrl}
              onChange={(event) => setTrackingUrl(event.target.value)}
              style={{ width: "100%", padding: 8, fontSize: 15, boxSizing: "border-box" }}
            />
          </label>

          {submitError && (
            <p style={{ color: "#b00020", fontSize: 14 }}>{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitState === "submitting"}
            style={{
              padding: "10px 20px",
              fontSize: 15,
              background: "#a9781f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: submitState === "submitting" ? "not-allowed" : "pointer",
            }}
          >
            {submitState === "submitting"
              ? "Envoi…"
              : "Sauvegarder et envoyer le courriel"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ShipmentTrackingEntryPage;
