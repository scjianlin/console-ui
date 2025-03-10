/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

const httpProxy = require('http-proxy')

const { getServerConfig } = require('../libs/utils')

const serverConfig = getServerConfig().server

module.exports = function(app) {
  const wsProxy = httpProxy.createProxyServer({
    ws: true,
    changeOrigin: true,
  })

  app.server.on('upgrade', (req, socket, head) => {
    
    const target = serverConfig.sailorServer.wsUrl
    console.log("target=",target);
    wsProxy.ws(req, socket, head, { target })

    wsProxy.on('proxyReqWs', (proxyReq, _req) => {
      const token = _req.headers.cookie.match(
        new RegExp('(?:^|;)\\s?token=(.*?)(?:;|$)', 'i')
      )[1]
      proxyReq.setHeader('Authorization', `Bearer ${token}`)
    })
  })
}
