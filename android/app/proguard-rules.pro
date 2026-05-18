# ── WebView JavaScript Interface ──────────────────────────────────────────────
# R8/ProGuard strips @JavascriptInterface methods by default because they are
# called from JavaScript (not Java), so the shrinker thinks they are dead code.
# Without these rules the Capacitor JS↔Native bridge is silently destroyed in
# every release/minified build, causing the entire app to freeze.
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ── Capacitor Core ────────────────────────────────────────────────────────────
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.annotation.Permission class * { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}

# ── Capacitor Keyboard Plugin ─────────────────────────────────────────────────
-keep class com.capacitorjs.plugins.keyboard.** { *; }

# ── Cordova compatibility layer ───────────────────────────────────────────────
-keep public class * extends org.apache.cordova.CordovaPlugin
-keep public class org.apache.cordova.** { *; }

# ── WebView clients ───────────────────────────────────────────────────────────
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# ── Debugging ─────────────────────────────────────────────────────────────────
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
