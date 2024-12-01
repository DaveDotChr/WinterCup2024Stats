package com.scraping.wintercup2024;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.Playwright.CreateOptions;
import com.microsoft.playwright.options.LoadState;

public class Main {
    public static void main(String[] args) throws IOException, InterruptedException, URISyntaxException {

        CreateOptions ops = new CreateOptions();
        Map<String, String> env = new HashMap<>();
        env.put("headless", "false");
        ops.env = env;
        Page page = Playwright.create(ops).chromium().launch(new BrowserType.LaunchOptions().setHeadless(false)).newPage();
        page.navigate("https://results.vertical-life.info/event/110/cr/650");
        page.waitForLoadState(LoadState.NETWORKIDLE);

        List<Locator> zeilen = page.locator(".r-row").all();

        page.onResponse((response) -> {
            if(!response.url().contains("https://results.vertical-life.info/api/v1/category_rounds/650/athlete_details/")){
                return;
            }
            response.finished();
            
            try {
                HttpResponse<String> body = HttpClient.newHttpClient().send(
                    HttpRequest.newBuilder().uri(new URI("http://localhost:3000/userRankingsWomen")).POST(BodyPublishers.ofString(response.text())).build(),
                    BodyHandlers.ofString(Charset.forName("UTF-8"))
                );
                System.out.println(body.body());
            } catch (IOException | InterruptedException | URISyntaxException e) {
                e.printStackTrace();
                System.exit(0);
            }



        });

        for (Locator locator : zeilen) {
            locator.click();
            page.waitForTimeout(2000);
            page.locator("#close").click();
        }


        System.exit(0);
    }
}