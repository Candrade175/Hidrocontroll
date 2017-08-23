using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;

namespace hidrocontroll.Controllers
{
    public class IrrigacaoController : BaseController
    {

        // GET api/Irrigacao
        public IQueryable<CAD_IRRIGACAO> GetCAD_IRRIGACAO()
        {
            return db.CAD_IRRIGACAO;
        }

        // GET api/Irrigacao/5
        [ResponseType(typeof(CAD_IRRIGACAO))]
        public IHttpActionResult GetCAD_IRRIGACAO(int id)
        {
            CAD_IRRIGACAO cad_irrigacao = db.CAD_IRRIGACAO.Find(id);
            if (cad_irrigacao == null)
            {
                return NotFound();
            }

            return Ok(cad_irrigacao);
        }

        // PUT api/Irrigacao/5
        public IHttpActionResult PutCAD_IRRIGACAO(int id, CAD_IRRIGACAO cad_irrigacao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_irrigacao.IDC_CAD_IRRIGACAO)
            {
                return BadRequest();
            }

            double antigoVolume = db.CAD_IRRIGACAO.Find(id).VOL_CONSUMIDO.Value;
            double novoVolume = cad_irrigacao.VOL_CONSUMIDO.Value;
            double diferenca = antigoVolume - novoVolume;
            db.Entry(cad_irrigacao).State = EntityState.Modified;

            try
            {
                db.SaveChanges();

                if (cad_irrigacao.CAD_RESERVATORIO!=null)
                {
                    cad_irrigacao.CAD_RESERVATORIO.VOL_ATUAL += diferenca;
                    new ReservatorioController().PutCAD_RESERVATORIO(cad_irrigacao.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO.Value, cad_irrigacao.CAD_RESERVATORIO);
                }

                CAD_PARCELA parcela = db.CAD_PARCELA.Where(p => p.IDC_CAD_PARCELA == cad_irrigacao.CAD_PARCELA_IDC_CAD_PARCELA).First();
                new ManejoController().atualizaManejo(parcela, cad_irrigacao.DAT_IRRIGACAO);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_IRRIGACAOExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Irrigacao
        [ResponseType(typeof(CAD_IRRIGACAO))]
        public IHttpActionResult PostCAD_IRRIGACAO(CAD_IRRIGACAO cad_irrigacao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_IRRIGACAO.Add(cad_irrigacao);
            db.SaveChanges();
            if (cad_irrigacao.CAD_RESERVATORIO != null)
            {
                cad_irrigacao.CAD_RESERVATORIO.VOL_ATUAL -= cad_irrigacao.VOL_CONSUMIDO;
                new ReservatorioController().PutCAD_RESERVATORIO(cad_irrigacao.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO.Value, cad_irrigacao.CAD_RESERVATORIO);
            }
            CAD_PARCELA parcela = db.CAD_PARCELA.Where(p => p.IDC_CAD_PARCELA == cad_irrigacao.CAD_PARCELA_IDC_CAD_PARCELA).First();
            new ManejoController().atualizaManejo(parcela, cad_irrigacao.DAT_IRRIGACAO);

            return CreatedAtRoute("DefaultApi", new { id = cad_irrigacao.IDC_CAD_IRRIGACAO }, cad_irrigacao);
        }

        // DELETE api/Irrigacao/5
        [ResponseType(typeof(CAD_IRRIGACAO))]
        public IHttpActionResult DeleteCAD_IRRIGACAO(int id)
        {
            CAD_IRRIGACAO cad_irrigacao = db.CAD_IRRIGACAO.Find(id);
            if (cad_irrigacao == null)
            {
                return NotFound();
            }

            db.CAD_IRRIGACAO.Remove(cad_irrigacao);
            db.SaveChanges();
            if (cad_irrigacao.CAD_RESERVATORIO != null)
            {
                cad_irrigacao.CAD_RESERVATORIO.VOL_ATUAL += cad_irrigacao.VOL_CONSUMIDO;
                new ReservatorioController().PutCAD_RESERVATORIO(cad_irrigacao.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO.Value, cad_irrigacao.CAD_RESERVATORIO);
            }
            CAD_PARCELA parcela = db.CAD_PARCELA.Where(p => p.IDC_CAD_PARCELA == cad_irrigacao.CAD_PARCELA_IDC_CAD_PARCELA).First();
            new ManejoController().atualizaManejo(parcela,cad_irrigacao.DAT_IRRIGACAO);
            return Ok(cad_irrigacao);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_IRRIGACAOExists(int id)
        {
            return db.CAD_IRRIGACAO.Count(e => e.IDC_CAD_IRRIGACAO == id) > 0;
        }
    }
}