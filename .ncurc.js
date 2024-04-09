/* ///////////////////////////////
// .ncurc configures how ncu behaves by default
// docs: https://www.npmjs.com/package/npm-check-updates
// /////////////////////////////*/
module.exports = {
    upgrade: false,
    // target: 'minor',
    // Which test to run between every upgrade
    doctor: false,
    doctorTest: 'npm run test:ci:with_emulator',
    reject: [
        '@rainbow-me/rainbowkit',
        'wagmi', // Upgrade wagmi only as details in @rainbow-me/rainbowkit docs: https://github.com/rainbow-me/rainbowkit/releases
    ]
}