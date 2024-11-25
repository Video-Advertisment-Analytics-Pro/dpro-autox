/**
 * アプリを起動する
 * @param {string} packageName
 */
function launchApp(packageName) {
    app.launch(packageName);
    waitForPackage(packageName, 5000);
}

/**
 * IDで要素をクリックする
 * @param {string} idStr
 */
function clickById(idStr) {
    const targetElement = id(idStr).findOnce();
    click(targetElement.bounds().centerX(), targetElement.bounds().centerY());
}

/**
 * ウェブビューを閉じる
 */
function closeWebView() {
    clickById("ig_browser_close_button");
}

/**
 * たまに出る広告の「すべての広告を見る」をクリックする
 */
function clickSeeAllAds() {
    clickById("intent_aware_ad_pivot_see_all_button");
}

/**
 * フィード投稿のCTAをクリックする
 */
function clickFeedCta() {
    clickById("row_feed_cta_wrapper");
}

function openAdWebViewAndClose() {
    clickFeedCta();
    sleep(5000);
    for (let i = 0; i < 5; i++) {
        scrollDown();
    }
    closeWebView();
}

function main() {
    launchApp("com.instagram.android");

    for (let count = 0; count < 300; count++) {
        try {
            let feed = id("row_feed_cta_wrapper").findOnce();
            if (feed) {
                openAdWebViewAndClose();
                scrollDown();
            }

            scrollDown();
            sleep(1000);
        } catch (error) {
            exit();
        }
    }
}

main();
