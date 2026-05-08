import 'package:flutter/material.dart';
import '../config/platform_config.dart';

class PlatformApp extends StatelessWidget {
  const PlatformApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: PlatformConfig.name,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(PlatformConfig.primaryColor),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(PlatformConfig.backgroundColor),
        useMaterial3: true,
      ),
      home: const _PlaceholderScreen(),
    );
  }
}

class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.work_outline, size: 64, color: Color(0xFF10B981)),
            const SizedBox(height: 24),
            Text(
              PlatformConfig.name,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              PlatformConfig.tagline,
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Flutter app — Phase 2',
              style: TextStyle(color: Colors.amber),
            ),
          ],
        ),
      ),
    );
  }
}
