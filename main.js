/**
 * アプリを起動する
 * @param {string} packageName
 */
function launchApp(packageName) {
    app.launch(packageName);
    waitForPackage(packageName, 5000);
}

/**
 * パッケージ名を指定し、アプリを強制停止する
 * @param {string} packageName パッケージ名
 * @returns
 */
function killApp(packageName) {
    var name = getPackageName(packageName);
    if (!name) {
        if (getAppName(packageName)) {
            name = packageName;
        } else {
            return false;
        }
    }
    app.openAppSetting(name);
    text(app.getAppName(name)).waitFor();
    let is_sure = textMatches(/(.*強.*|.*制.*|.*停.*|.*止.*)/).findOne();
    if (is_sure.enabled()) {
        text("強制停止").findOne().click();
        sleep(1000);
        text("強制停止する").findOne().click();
        sleep(1000);
        back();
        sleep(1000);
    } else {
        back();
    }
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
    if (id("ig_browser_close_button").findOnce()) {
        closeWebView();
    } else if (id("action_bar_button_back").findOnce()) {
        clickById("action_bar_button_back");
    } else {
        throw new Error("Unknown screen");
    }
}

function restart() {
    killApp("com.instagram.android");

    sleep(5000);
    main();
}

function main() {
    console.log("Start");
    launchApp("com.instagram.android");

    for (let i = 0; i < 50; i++) {
        try {
            let feed = id("row_feed_cta_wrapper").findOnce();
            if (feed) {
                openAdWebViewAndClose();
                sleep(3000);
                scrollDown();
            }

            scrollDown();
            sleep(1000);
        } catch (error) {
            restart();
        }
        console.log("count", i);
    }

    restart();
}

main();
