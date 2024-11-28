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
        home();
        sleep(1000);
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
    // for (let i = 0; i < 5; i++) {
    //     scrollDown();
    // }
    // if (id("ig_browser_close_button").findOnce()) {
    //     closeWebView();
    // } else if (id("action_bar_button_back").findOnce()) {
    //     clickById("action_bar_button_back");
    // }
}

function restart() {
    killApp("com.instagram.android");

    sleep(5000);
    main();
}

// // 単一の実行単位としてのmain関数
// function main() {
//     console.log("Start");
//     launchApp("com.instagram.android");

//     const startTime = new Date().getTime();
//     let feedCounter = 0;

//     for (let i = 0; i < 50; i++) {
//         try {
//             const currentTime = new Date().getTime();
//             if (currentTime - startTime >= 180000) {
//                 console.log("3分経過したため、終了します");
//                 break;
//             }

//             let feed = id("row_feed_cta_wrapper").findOnce();
//             if (feed) {
//                 feedCounter++;
//                 if (feedCounter % 3 === 0) {
//                     openAdWebViewAndClose();
//                     break;
//                 }
//             }

//             scrollDown();
//             sleep(1000);
//         } catch (error) {
//             console.log("エラーが発生しました:", error);
//         }
//     }

//     restart();
// }

function mainLoop() {
    while (true) {
        try {
            main();
        } catch (error) {
            console.log("エラーが発生しました:", error);
        }

        // アプリを終了して再起動
        killApp("com.instagram.android");
        sleep(5000);
    }
}

// 定数の定義
const WORK_INTERVAL_MINUTES = 15; // 作業間隔（分）
const BREAK_DURATION_MINUTES = 10; // 休憩時間（分）

function main() {
    // 最初の休憩時間を設定
    let nextBreakTime =
        new Date().getTime() + WORK_INTERVAL_MINUTES * 60 * 1000;

    while (true) {
        const currentTime = new Date().getTime();

        // 休憩時間になったかチェック
        if (currentTime >= nextBreakTime) {
            console.log(`${BREAK_DURATION_MINUTES}分間休憩します。`);
            sleep(BREAK_DURATION_MINUTES * 60 * 1000); // 休憩

            // 次の休憩時間を設定（現在時刻から指定時間後）
            nextBreakTime =
                new Date().getTime() + WORK_INTERVAL_MINUTES * 60 * 1000;
            continue;
        }

        console.log("Start");
        launchApp("com.instagram.android");

        let feedCounter = 0;

        for (let i = 0; i < 50; i++) {
            let feed = id("row_feed_cta_wrapper").findOnce();
            if (feed) {
                feedCounter++;

                if (feedCounter % 3 === 0) {
                    clickFeedCta();
                    sleep(5000);
                    back();
                    sleep(1000);
                }
            }
            scrollDown();
            sleep(1000);
        }

        // アプリを終了して再起動
        killApp("com.instagram.android");
        sleep(5000);
    }
}

main();
