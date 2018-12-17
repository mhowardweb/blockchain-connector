import { Aes, key, PrivateKey } from 'bitsharesjs';
import { Apis } from 'bitsharesjs-ws';

/**
 * get wallets from local storage
 */
const getWallets = () => {
  let wallets = localStorage.getItem(`bts_wallets_${Apis.instance().chain_id}`);
  if (!wallets) {
    wallets = [];
  } else {
    wallets = JSON.parse(wallets);
  }
  return wallets;
};

const backupWallet = () => {
  const localStorageWallets = getWallets();
  if (!(localStorage.getItem(`bts_wallets_bak3_${Apis.instance().chain_id}`))) {
    localStorage.setItem(`bts_wallets_bak3_${Apis.instance().chain_id}`, JSON.stringify(localStorageWallets));
  }
};

const mergeWallets = async () => {
  const query = util.query2Obj(location.hash);
  const isNative = query.platform === 'ios' || query.platform === 'android';
  await(IndexedDB.openDB(`bts_wallets_${Apis.instance().chain_id}`, 1, {
    name: 'wallet',
    key: 'walletKey',
  }).then((db) => {
    const walletDB = db;
    return IndexedDB.getData(walletDB, 'wallet', `bts_wallets_${Apis.instance().chain_id}`).then((res) => {
      if (res) {
        const localStorageWallets = get_wallets();
        const unionWallets = unionBy(localStorageWallets, res.value, 'account');
        localStorage.setItem(`gxb_wallets_${Apis.instance().chain_id}`, JSON.stringify(unionWallets));
      }
      IndexedDB.closeDB(walletDB);
      if (isNative) {
        return get_wallet_native().then((wallets_native) => {
          const localStorageWallets = get_wallets();
          const unionWallets = unionBy(localStorageWallets, wallets_native, 'account');
          localStorage.setItem(`gxb_wallets_${Apis.instance().chain_id}`, JSON.stringify(unionWallets));
          return null;
        }).catch((ex) => {
          console.error('failed when merge wallets from native', ex);
          return null;
        });
      }
      return null;
    }).catch(ex => null);
  }).catch((ex) => {
    console.error('failed when merge wallets from indexed db', ex);
    return get_wallet_native().then((wallets_native) => {
      const localStorageWallets = get_wallets();
      const unionWallets = unionBy(localStorageWallets, wallets_native, 'account');
      localStorage.setItem(`gxb_wallets_${Apis.instance().chain_id}`, JSON.stringify(unionWallets));
      return null;
    }).catch((ex) => {
      console.error('failed when merge wallets from native', ex);
      return null;
    });
  }));
});

/**
 * save wallets to indexedDB
 * @param wallets
 */
const setWalletsDb = async (wallets) => {
      let walletDB = null;
      return IndexedDB.openDB(`bts_wallets_${Apis.instance().chain_id}`, 1, walletDB, {
          name: 'wallet',
          key: 'walletKey'
      }).then((db) => {
          let walletDB = db;
          return IndexedDB.putJSON(walletDB, 'wallet', {
              walletKey: `bts_wallets_${Apis.instance().chain_id}`,
              value: wallets
          }).then(() => {
              IndexedDB.closeDB(walletDB);
              resolve();
          });
      }).catch((ex) => {
          resolve();
      });
  });
};

/**
 * save wallets to native storage
 * @param wallets
 * @returns {bluebird}
 */
const set_wallet_native = (wallets) => {
  return new Promise((resolve, reject) => {
      let query = util.query2Obj(location.hash);
      let pluginName = 'AppConfig';
      if (query.platform === 'ios') {
          pluginName = 'KV';
      }
      cordova.exec(function () { //eslint-disable-line
          console.log('wallets have been save to native storage successfully');
          resolve();
      }, function () {
          reject();
      }, pluginName, 'set', [`gxb_wallets_${Apis.instance().chain_id}`, JSON.stringify(wallets)]);
  });
};

/**
* load wallets from native storage
* @returns {bluebird}
*/
const get_wallet_native = () => {
  return new Promise((resolve, reject) => {
      let query = util.query2Obj(location.hash);
      let pluginName = 'AppConfig';
      if (query.platform === 'ios') {
          pluginName = 'KV';
      }
      cordova.exec(function (result) { //eslint-disable-line
          console.log('wallets from native storage:', result);
          let wallets_str = ((result && typeof result === 'string') ? result : '[]') || '[]';
          let wallets = result instanceof Array ? result : JSON.parse(wallets_str);
          resolve(wallets);
      }, function () {
          reject();
      }, pluginName, 'get', [`gxb_wallets_${Apis.instance().chain_id}`]);
  });
};

/**
* save wallets into local storage
* @param wallets
*/
const set_wallets = (wallets) => {
  return new Promise((resolve, reject) => {
      localStorage.setItem(`gxb_wallets_${Apis.instance().chain_id}`, JSON.stringify(wallets));
      try {
          set_wallets_db(wallets);
          set_wallet_native(wallets);
      } catch (ex) {

      } finally {
          resolve();
      }
  });
};

/**
* get index of current wallet
* @returns {number}
*/
const get_wallet_index = () => {
  let wallets = get_wallets();
  let index = localStorage.getItem(`gxb_wallet_index_${Apis.instance().chain_id}`);
  if (!index) {
      return 0;
  }
  index = Number(index);
  if ((index + 1) > wallets.length) {
      set_wallet_index(wallets.length - 1);
      return wallets.length - 1;
  }
  return index;
};

/**
* set index of current wallet
* @param index
*/
const set_wallet_index = (index) => {
  index = Number(index);
  let wallets = get_wallets();
  localStorage.setItem(`gxb_wallet_index_${Apis.instance().chain_id}`, Math.min(wallets.length - 1, index));
};

/**
 * update wallet in local storage
 * @param wallet
 */
const update_wallet = (wallet) => {
  return new Promise((resolve, reject) => {
      let wallets = get_wallets();
      let updated = 0; // eslint-disable-line
      wallets = wallets.map((w) => {
          if (w.account == wallet.account) {
              updated += 1;
              return wallet;
          }
          return w;
      });
      return set_wallets(wallets).then(() => {
          resolve();
      });
  });
};

/**
* del wallet from local storage
* @param wallet
*/
const del_wallet = (wallet) => {
  return new Promise((resolve, reject) => {
      let wallets = get_wallets();
      for (let i = 0; i < wallets.length; i++) {
          if (wallet.account === wallets[i].account) {
              wallets.splice(i, 1);
          }
      }
      return set_wallets(wallets).then(() => {
          resolve();
      });
  });
};

/**
* unlock wallet
* @param account
* @param password
* @returns {bluebird}
*/
const unlock_wallet = (account, password) => {
  return new Promise((resolve, reject) => {
      let wallets = get_wallets();
      let wallet = find(wallets, function (w) {
          return w.account == account;
      });
      let password_private = PrivateKey.fromSeed(password);
      let password_pubkey = password_private.toPublicKey().toPublicKeyString(); // used to validate password
      if (wallet == null) {
          reject(new Error(i18n.t('unlock.account_not_found')));
      } else if (password_pubkey != wallet.password_pubkey) {
          reject(new Error(i18n.t('unlock.error.invalid_password')));
      } else {
          let password_aes = Aes.fromSeed(password);
          let encryption_plainbuffer = password_aes.decryptHexToBuffer(wallet.encryption_key);
          let aes_private = Aes.fromSeed(encryption_plainbuffer);
          let wifKey = aes_private.decryptHexToText(wallet.encrypted_wifkey);
          resolve({
              wifKey,
              wallet
          });
      }
  });
};

/**
* import account into wallet by passing wif key and password
* @param wifKey
* @param password
* @returns {bluebird}
*/
const import_account = (wifKey, password) => {
  return new Promise((resolve, reject) => {
      let password_aes = Aes.fromSeed(password);
      let encryption_buffer = key.get_random_key().toBuffer();
      let encryption_key = password_aes.encryptToHex(encryption_buffer);
      let local_aes_private = Aes.fromSeed(encryption_buffer);
      let encrypted_wifkey = local_aes_private.encryptToHex(wifKey);
      let password_private = PrivateKey.fromSeed(password);
      let password_pubkey = password_private.toPublicKey().toPublicKeyString(); // used to validate password

      let imported = [];
      let exist = [];

      let private_key = PrivateKey.fromWif(wifKey);
      let public_key = private_key.toPublicKey().toPublicKeyString();
      resolve(Apis.instance().db_api().exec('get_key_references', [[public_key]]).then((resp) => {
          if (resp.length > 0) {
              return uniq(resp[0]);
          } else {
              throw new Error(i18n.t('wallet_import.error.account_not_found'));
          }
      }).then((account_ids) => {
          return Apis.instance().db_api().exec('get_objects', [account_ids]).then((accounts) => {
              if (accounts.length > 0) {
                  let wallets = get_wallets();
                  accounts.forEach((account) => {
                      let weight_threshold = account.active.weight_threshold;
                      // available key should have enough weight
                      let isKeyAvailable = some(account.active.key_auths, function (key) {
                          if (key[0] == public_key && key[1] >= weight_threshold) {
                              return true;
                          }
                          return false;
                      });
                      if (isKeyAvailable) {
                          let alreadyExist = some(wallets, function (wallet) {
                              return wallet.account == account.name;
                          });
                          let wallet = {
                              account: account.name,
                              password_pubkey,
                              encryption_key,
                              encrypted_wifkey,
                              backup_date: null
                          };
                          if (!alreadyExist) {
                              wallets.push(wallet);
                              imported.push(wallet);
                          } else {
                              wallets = map(wallets, w => {
                                  if (w.account === account.name) {
                                      return wallet;
                                  }
                                  return w;
                              });
                              imported.push(wallet);
                              // console.log('account:', account.name, 'already exist');
                              // exist.push({
                              //     account: account.name
                              // });
                          }
                      }
                  });
                  if (imported.length > 0) {
                      set_wallets(wallets);
                      localStorage.setItem(`bts_wallet_index_${Apis.instance().chain_id}`, wallets.length - 1);
                  }
                  return {
                      imported,
                      exist
                  };
              } else {
                  throw new Error(i18n.t('wallet_import.error.account_not_found'));
              }
          });
      }));
  });
};

/**
* fetch accounts by public keys
* @param publicKeys
*/
const fetch_reference_accounts = (account_names) => {
  return new Promise((resolve, reject) => {
      fetch_accounts(account_names).then((accounts) => {
          let accountArr = [];
          accounts.forEach(account => {
              accountArr.push({
                  account_id: account.id,
                  name: account.name,
                  public_key: account.active.key_auths[0][0]
              });
          });
          let uniqPublickeys = uniq(accountArr.map(item => item.public_key));
          Apis.instance().db_api().exec('get_key_references', [uniqPublickeys]).then((resp) => {
              if (resp.length > 0) {
                  let account_maps = {};
                  resp.forEach((ids, i) => {
                      ids.forEach(id => {
                          account_maps[id] = uniqPublickeys[i];
                      });
                  });
                  let account_ids = uniq(flatten(resp));
                  let new_account_ids = account_ids.filter(account_id => {
                      return !some(accountArr, (item) => {
                          return item.account_id == account_id;
                      });
                  });
                  get_objects(new_account_ids).then(function (accounts) {
                      let wallets = get_wallets();
                      accounts.forEach((account) => {
                          let alreadyExist = some(wallets, function (wallet) {
                              return wallet.account == account.name;
                          });
                          if (!alreadyExist) {
                              let publicKey = account_maps[account.id];
                              let sameAccountName = accountArr.find(account => account.public_key === publicKey).name;
                              let wallet = JSON.parse(JSON.stringify(wallets.find(wallet => wallet.account === sameAccountName)));
                              wallet.account = account.name;
                              let weight_threshold = account.active.weight_threshold;
                              // available key should have enough weight
                              let isKeyAvailable = some(account.active.key_auths, function (key) {
                                  if (key[0] == publicKey && key[1] >= weight_threshold) {
                                      return true;
                                  }
                                  return false;
                              });
                              wallet.partial = !isKeyAvailable;
                              wallets.push(wallet);
                          }
                      });
                      set_wallets(wallets);
                      resolve(wallets);
                  }).catch(reject);
              } else {
                  throw new Error(i18n.t('wallet_import.error.account_not_found'));
              }
          }).catch(reject);
      }).catch(reject);
  });
};

/**
* create an account by faucet api and import
* @param account
* @param password
* @returns {bluebird}
*/
const create_account = (account, password) => {
  return new Promise((resolve, reject) => {
      resolve(fetch_dictionary().then((dictionary) => {
          let brainKey = key.suggest_brain_key(dictionary);
          let privateKey = key.get_brainPrivateKey(brainKey);
          let publicKey = privateKey.toPublicKey().toPublicKeyString();
          return Vue.http.post(`${process.env.faucet_addr}/account/register`, {
              account: {
                  name: account,
                  owner_key: publicKey,
                  active_key: publicKey
              }
          }).then((resp) => {
              let wallets = get_wallets();
              let wifKey = privateKey.toWif();
              let password_aes = Aes.fromSeed(password);
              let encryption_buffer = key.get_random_key().toBuffer();
              let encryption_key = password_aes.encryptToHex(encryption_buffer);
              let local_aes_private = Aes.fromSeed(encryption_buffer);
              let encrypted_wifkey = local_aes_private.encryptToHex(wifKey);
              let password_private = PrivateKey.fromSeed(password);
              let password_pubkey = password_private.toPublicKey().toPublicKeyString(); // used to validate password
              let wallet = {
                  account: account,
                  password_pubkey,
                  encryption_key,
                  encrypted_wifkey,
                  backup_date: null
              };
              wallets.push(wallet);
              set_wallets(wallets);
              localStorage.setItem(`gxb_wallet_index_${Apis.instance().chain_id}`, wallets.length - 1);
              return wallet;
          });
      }));
  });
};


export default {
  getWallets, backupWallet, mergeWallets,
};
