<!-- markdownlint-disable MD041 MD013 MD024 MD001 MD045 MD026 -->

![CrossCode](/src/img1.png)  

![demonizer](/src/gif1.gif)

# CrossCode demo generator

## I do NOT own the rights to the distributed demos!!!

All parts except the mods and the modloader are the property of [Radical Fish Games](https://www.radicalfishgames.com), the creator of [CrossCode](https://www.cross-code.com).  
This project's purpose is to spread the greatness of this game, and to give blind people a way to try the game out (see [CrossedEyes](https://github.com/CCDirectLink/CrossedEyes)).  
The produced demos cover the same scope as the original demos, the game is physically unplayable after that (even if you tried really hard).  

# Usage

| Argument | Value type | Description |
| --- | --- | --- |
| --file | FILE | The original crosscode archive. Has to be a `.tar.gz` archive (REQUIRED) |
| --platform | windows or linux or macos | Target platform (REQUIRED) |
| --nwjs | FILE | NW.js archive path. Has to be a `.tar.gz` archive |
| --nocompress | none | Wont pack the output into a `.zip` |
| --nocleanup | none | Wont remove the working directory after finishing |
| --prettyjs | none | Will prettify `game.compiled.js` |
| --bundle-crossedeyes | none | Will bundle the [CrossedEyes](https://github.com/CCDirectLink/CrossedEyes) mod |

## Example usage

```bash
sh run.sh --file archives/cc-orig-linux.tar.gz --platform linux --nwjs archives/nwjs-sdk-v0.72.0-linux-x64.tar.gz --nocleanup --prettyjs
# now you can directly run CrossCode
./tmp/CrossCode
```

```bash
sh run.sh --file archives/cc-orig-windows.tar.gz --platform windows --bundle-crossedeyes
```

### Download NW.js quickly

```bash
mkdir -p archives
cd archives
wget 'https://dl.nwjs.io/v0.72.0/nwjs-v0.72.0-linux-x64.tar.gz'
cd ..
```

### Original CrossCode archive downloading

If you purchased the game on steam, you can use [DepotDownloader](https://github.com/SteamRE/DepotDownloader)  

##### Linux archive

```bash
./DepotDownloader -username 'grasshead' -password 'justice' -app '368340' -depot '368343' -manifest '1605626617428248393'
```

##### Windows archive

```bash
./DepotDownloader -username 'grasshead' -password 'justice' -app '368340' -depot '368349'
```

Then go to the folder that contians the CrossCode executable, and run

```bash
tar -cf cc-orig-PLATFORM.tar.gz *
```
