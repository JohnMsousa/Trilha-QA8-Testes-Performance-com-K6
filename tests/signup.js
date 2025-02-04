import http from "k6/http";
import { sleep, check } from "k6";
import uuid from "./libs/uuid.js";

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        "summary-signup.html": htmlReport(data),
    };
}

export const options = {
    vus: 10,
    duration: "30s",
    thresholds: {
        http_req_duration: ["p(95)<2000"], // 95% das requisicoes devem responder em ate 2s
        http_req_failed: ["rate<0.01"], // 1% das requisicoes podem ocorrer erro
    },
};

export default function () {
    const url = "http://localhost:3333/signup";

    const payload = JSON.stringify({ email: `${uuid.v4().substring(24)}@qa.qacademy.com.br`, password: "123456" });

    const headers = {
        "headers": {
            "Content-Type": "application/json",
        },
    };

    const res = http.post(url, payload, headers);

    console.log(res.body);

    check(res, {
        "staus should be 201": (r) => r.status === 201,
    });

    sleep(1);
}
